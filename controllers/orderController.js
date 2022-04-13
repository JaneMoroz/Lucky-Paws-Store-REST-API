const catchAsync = require('./../utils/catchAsync');
const Order = require('./../models/orderModel');
const factory = require('./handlerFactory');
const Cart = require('../models/cartModel');
const AppError = require('./../utils/appError');

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
