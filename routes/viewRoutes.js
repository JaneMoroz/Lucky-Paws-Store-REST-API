const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getNewArrivals);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewController.getProduct
);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignUpForm);
router.get('/my-account', authController.protect, viewController.getAccount);

module.exports = router;
