const Product = require('./../models/productModel');
const Order = require('./../models/orderModel');
const Review = require('./../models/reviewModel');
const Cart = require('./../models/cartModel');
const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');

////////////////////////////////////////////////////////////////
// Home Page/Product Page
exports.getProducts = catchAsync(async (req, res, next) => {
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
  // 1. Get Data
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

////////////////////////////////////////////////////////////////
// Login/SignUp
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

////////////////////////////////////////////////////////////////
// My account
exports.getAccount = (req, res) => {
  res.status(200).render('accountDetails', {
    title: 'Your account',
  });
};

exports.getOrders = catchAsync(async (req, res, next) => {
  // Find orders by userId
  const unsortedOrders = await Order.find({ user: req.user.id }).populate({
    path: 'cart',
    fields: 'products',
    path: 'user',
  });

  const orders = unsortedOrders.sort((a, b) => b.created - a.created);

  res.status(200).render('accountMyOrders', {
    title: 'Your orders',
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  // Find order by id
  const order = await Order.findById(req.params.id).populate({
    path: 'cart',
    fields: 'products',
    path: 'user',
  });

  res.status(200).render('accountMyOrder', {
    title: 'Your order',
    order,
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  // Find orders by userId
  const unsortedReviews = await Review.find({ user: req.user.id }).populate({
    path: 'product',
    fields: 'name primaryImage',
  });

  const reviews = unsortedReviews.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).render('accountMyList', {
    title: 'Your reviews',
    reviews,
    myReviews: true,
  });
});

////////////////////////////////////////////////////////////////
// Admin
exports.getAllProducts = catchAsync(async (req, res, next) => {
  const prod = new APIFeatures(Product.find(), {
    sort: '-created',
  }).sort();

  let products = await prod.query;

  res.status(200).render('accountMyList', {
    title: 'List of Products',
    allProducts: true,
    products,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const u = new APIFeatures(User.find(), {
    sort: 'name',
  }).sort();

  let users = await u.query;

  res.status(200).render('accountMyList', {
    title: 'List of Users',
    allUsers: true,
    users,
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const unsortedReviews = await Review.find().populate({
    path: 'product',
    fields: 'name primaryImage',
  });

  const reviews = unsortedReviews.sort((a, b) => b.createdAt - a.createdAt);

  res.status(200).render('accountMyList', {
    title: 'List of Reviews',
    allReviews: true,
    reviews,
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  res.status(200).render('accountMyList', {
    title: 'List of Reviews',
    allOrders: true,
  });
});

exports.getAddNewProductForm = catchAsync(async (req, res, next) => {
  res.status(200).render('accountAddNewProduct', {
    title: 'Add New Product',
  });
});

exports.getEditProductForm = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  res.status(200).render('accountEditProduct', {
    title: 'Edit Product',
    product,
  });
});

////////////////////////////////////////////////////////////////
// Cart
exports.getCart = catchAsync(async (req, res, next) => {
  let cart = [];
  const cartArr = await Cart.find({
    user: req.user.id,
    ordered: false,
  });

  if (cartArr.length >= 1) {
    cart = cartArr[0];
  } else cart = [];

  res.status(200).render('cart', {
    title: 'Your Cart',
    cart,
  });
});
