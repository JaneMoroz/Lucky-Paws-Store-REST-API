const Product = require('./../models/productModel');
const Order = require('./../models/orderModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getNewArrivals = catchAsync(async (req, res, next) => {
  // 1. Get Data
  // New Arrivals
  const newProd = new APIFeatures(Product.find(), {
    sort: '-created',
    limit: '4',
  })
    .sort()
    .paginate();

  let newArrivals = await newProd.query;

  // On Sale
  let onSaleProd = new APIFeatures(Product.find(), {
    priceDiscount: { gt: '0' },
    limit: '4',
  })
    .filter()
    .paginate();

  let onSale = await onSaleProd.query;

  // Brand Collection 1
  let coll1Prod = new APIFeatures(Product.find(), {
    brand: "Butcher's",
    limit: '3',
  })
    .filter()
    .paginate();

  let collection1 = await coll1Prod.query;

  // Brand Collection 2
  let coll2Prod = new APIFeatures(Product.find(), {
    brand: 'Diva',
    limit: '3',
  })
    .filter()
    .paginate();

  let collection2 = await coll2Prod.query;
  // 2. Build Template
  // 3. Render Template Using Data
  res.status(200).render('home', {
    title: 'Home',
    newArrivals,
    onSale,
    collection1,
    collection2,
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  console.log('we here');
  // 1. Get Data
  console.log(req.params.slug);
  const product = await Product.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 2. Build Template
  // 3. Render Template Using Data
  res.status(200).render('product', {
    title: 'Home',
    product,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getSignUpForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('accountDetails', {
    title: 'Your account',
  });
};

exports.getOrders = catchAsync(async (req, res, next) => {
  // Find orders by userId
  const orders = await Order.find({ user: req.user.id }).populate({
    path: 'cart',
    fields: 'products',
    path: 'user',
  });

  res.status(200).render('accountMyOrders', {
    title: 'Your orders',
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  // Find order by id
  const order = await Order.findById(req.params.id).populate({
    path: 'cart',
    fields: 'products',
    path: 'user',
  });

  console.log(order);

  res.status(200).render('accountMyOrder', {
    title: 'Your order',
    order,
  });
});
