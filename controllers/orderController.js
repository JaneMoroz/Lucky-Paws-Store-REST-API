const Stripe = require('stripe');
const catchAsync = require('./../utils/catchAsync');
const Order = require('./../models/orderModel');
const factory = require('./handlerFactory');
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const AppError = require('./../utils/appError');

////////////////////////////////////////////////////////////////
// Stripe
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get user and cart
  let userIsValid = false;
  const userId = req.user.id;
  const cartId = req.body.cartId;
  const cart = await Cart.findById(cartId);

  // 2. Check if user is the same
  if (userId === String(cart.user)) {
    userIsValid = true;
  }

  if (userIsValid) {
    // 3 Create items array
    let line_items = [];
    cart.products.forEach((product) => {
      var description = 'default';
      if (product.color !== undefined) {
        description = `color: ${product.color}`;
      }
      if (product.style !== undefined) {
        description = `style: ${product.style}`;
      }
      const line_item = {
        quantity: product.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: product.purchasePrice * 100, // price expected in cents
          product_data: {
            name: `${product.product.name}`,
            images: [`${product.product.primaryImage}`],
            description,
          },
        },
      };
      line_items.push(line_item);
    });

    // 4. Create checkout session
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: [
          'US',
          'CA',
          'GB',
          'RU',
          'UA',
          'KZ',
          'FI',
          'LV',
          'FR',
          'DE',
          'ES',
        ],
      },
      success_url: `${process.env.REACT_CLIENT}/account/my-orders`,
      cancel_url: `${process.env.REACT_CLIENT}/cart`,
      customer_email: req.user.email,
      client_reference_id: cartId,
      mode: 'payment',
      line_items,
    });

    res.status(200).json({
      status: 'success',
      data: {
        data: session,
      },
    });
  }
});

// Create order (no STRIPE)
exports.createOrder = catchAsync(async (req, res, next) => {
  // Get Cart Items
  const cart = await Cart.findById(req.params.cartId);

  // Check User
  const userId = req.user.id;

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  if (String(cart.user) !== userId) {
    return next(new AppError('Something went wrong, try again later', 404));
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

// Create order (after STRIPE payment complete)
const createOrderCheckout = async (session) => {
  const cartId = session.client_reference_id;
  const cart = await Cart.findById(cartId);
  const { line1, line2, city, postal_code, country } = session.shipping.address;
  const userId = (await User.findOne({ email: session.customer_email })).id;
  const addressLine = `${line1}`;
  if (line2) {
    addressLine = `${line1}, ${line2}`;
  }

  // Create order
  await Order.create({
    cart: cartId,
    user: userId,
    shippingAddress: {
      address: addressLine,
      city,
      postalCode: postal_code,
      country,
    },
    paymentMethod: session.payment_method_types[0],
    isPaid: true,
    paidAt: Date.now(),
  });

  // Mark cart as "ordered"
  cart.ordered = true;
  await cart.save();
};

// Create order after STRIPE payment success
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    createOrderCheckout(event.data.object);
  }

  res.status(200).json({
    received: true,
  });
};

// Get all orders
exports.getAllOrders = factory.getAll(Order);

// Get order
exports.getOrder = factory.getOne(Order);

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
