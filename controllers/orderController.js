const Stripe = require('stripe');
const catchAsync = require('./../utils/catchAsync');
const Order = require('./../models/orderModel');
const factory = require('./handlerFactory');
const Cart = require('../models/cartModel');
const AppError = require('./../utils/appError');

////////////////////////////////////////////////////////////////
// Stripe
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get cart
  const cart = await Cart.findById(req.params.cartId);
  // const address = req.params.address.split(', ');

  // let customer_details = {
  //   address: {
  //     country: `${address[0] ? address[0] : ''}`,
  //     city: `${address[1] ? address[1] : ''}`,
  //     postal_code: `${address[2] ? address[2] : ''}`,
  //     line1: `${address[3] ? address[3] : ''}`,
  //   },
  // };
  // console.log(customer_details);

  let line_items = [];
  cart.products.forEach((product) => {
    const line_item = {
      quantity: product.quantity,
      price_data: {
        currency: 'usd',
        unit_amount: product.purchasePrice * 100, // price expected in cents
        product_data: {
          name: `${product.product.name}`,
          images: [`${product.product.primaryImage}`],
        },
      },
    };
    line_items.push(line_item);
  });

  // 2. Create checkout session
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/my-orders`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    mode: 'payment',
    line_items,
  });

  // 3. Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// const createBookingCheckout = async (session) => {
//   const tour = session.client_reference_id;
//   const user = (await User.findOne({ email: session.customer_email })).id;
//   const price = session.amount_total / 100;
//   await Booking.create({ tour, user, price });
// };

// Create order
exports.createOrder = catchAsync(async (req, res, next) => {
  // Get Cart Items
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  // Create order
  const order = await Order.create({
    cart: cart,
    user: req.user,
    shippingAddress: {
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
    },
    paymentMethod: req.body.paymentMethod,
    paymentResult: req.body.paymentResult,
  });

  // Mark cart as "ordered"
  cart.ordered = true;
  await cart.save();

  res.status(201).json({
    status: 'success',
    data: {
      data: order,
    },
  });
});

// exports.webhookCheckout = (req, res, next) => {
//   const signature = req.headers['stripe-signature'];
//   let event;
//   try {
//     const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       signature,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook error: ${err.message}`);
//   }

//   if (event.type === 'checkout.session.completed') {
//     createOrderCheckout(event.data.object);
//   }

//   res.status(200).json({
//     received: true,
//   });
// };

////////////////////////////////////////////////////////////////
// Get "me" Middleware
exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

// Get all orders
exports.getAllOrders = factory.getAll(Order);

// Get order
exports.getOrder = factory.getOne(Order);

// Update order to paid
exports.updateOrderToPaid = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: Date.now(),
    email_address: req.body.payer.email_address,
  };

  const updatedOrder = await order.save();

  res.status(201).json({
    status: 'success',
    data: {
      data: updatedOrder,
    },
  });
});

// Update order to delivered
exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('No order found with that ID', 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(201).json({
    status: 'success',
    data: {
      data: updatedOrder,
    },
  });
});
