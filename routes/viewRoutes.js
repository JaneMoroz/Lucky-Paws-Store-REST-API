const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

////////////////////////////////////////////////////////////////
// Home Page/Product Page
router.get('/', authController.isLoggedIn, viewController.getProducts);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewController.getProduct
);

////////////////////////////////////////////////////////////////
// Login/SignUp
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignUpForm);

////////////////////////////////////////////////////////////////
// My account
router.get('/my-account', authController.protect, viewController.getAccount);
router.get('/my-orders', authController.protect, viewController.getOrders);
router.get('/my-orders/:id', authController.protect, viewController.getOrder);
router.get('/my-reviews/', authController.protect, viewController.getReviews);

////////////////////////////////////////////////////////////////
// My account + Admin
// router.use(authController.restrictTo('admin'));

router.get(
  '/manage-products/',
  authController.protect,
  viewController.getAllProducts
);

router.get(
  '/manage-users/',
  authController.protect,
  viewController.getAllUsers
);
router.get(
  '/manage-reviews/',
  authController.protect,
  viewController.getAllReviews
);
router.get(
  '/manage-orders/',
  authController.protect,
  viewController.getAllOrders
);

router.get(
  '/manage-products/add',
  authController.protect,
  viewController.getAddNewProductForm
);

module.exports = router;
