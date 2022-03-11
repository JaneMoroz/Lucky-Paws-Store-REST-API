const catchAsync = require('./../utils/catchAsync');
const Order = require('./../models/orderModel');
const factory = require('./handlerFactory');
const Cart = require('../models/cartModel');

////////////////////////////////////////////////////////////////
// Get "me" Middleware
exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

// Get product id
// exports.setOrderId = (req, res, next) => {
//   if (!req.body.product) req.body.product = req.params.productId;
//   req.body.user = req.user.id;
//   next();
// };

// Get all orders
exports.getAllOrders = factory.getAll(Order);

// Get order
exports.getOrder = factory.getOne(Order);

// Create order
exports.createOrder = catchAsync(async (req, res, next) => {
  // Get Cart Items
  const cart = await Cart.findById(req.params.cartId);
  console.log(cart);

  if (!cart) {
    return next(new AppError('No cart found with that ID', 404));
  }

  // Calculate total taxes
  const taxPrice = cart.products.reduce(function (acc, obj) {
    return acc + obj.totalTax;
  }, 0);

  console.log(taxPrice);

  // Calculate total price before shipping
  const totalPriceBeforeShipping = cart.products.reduce(function (acc, obj) {
    return acc + obj.totalPrice;
  }, 0);

  console.log(totalPriceBeforeShipping);

  // Calculate shipping costs and total price
  const shippingPrice = totalPriceBeforeShipping > 200 ? 0 : 15;
  const totalPrice = totalPriceBeforeShipping + shippingPrice;

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
    taxPrice: taxPrice,
    shippingPrice: shippingPrice,
    totalPrice: totalPrice,
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

// Update order to paid
exports.updateOrderToPaid = catchAsync(async (req, res, next) => {});

// Update order to delivered
exports.updateOrderToDelivered = catchAsync(async (req, res, next) => {});
