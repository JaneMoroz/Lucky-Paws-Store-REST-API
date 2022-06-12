const express = require('express');
const cartController = require('../controllers/cartController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

////////////////////////////////////////////////////////////////
// Customer Cart Routes
router
  .route('/myCart')
  .get(userController.getMe, cartController.getCarts)
  .patch(cartController.updateCart);

////////////////////////////////////////////////////////////////
// Add Cart Item

router.route('/').post(cartController.addCartItem);

module.exports = router;
