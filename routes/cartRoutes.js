const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('./../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

////////////////////////////////////////////////////////////////
// Customer Cart Routes
router
  .route('/myCart')
  .get(authController.getMe, cartController.getCarts)
  .post(cartController.updateCart)
  .delete(cartController.deleteCart);

router.route('/myCart/:id').get(authController.getMe, cartController.getCart);

router.route('/myCart/:id/:cartItemId').patch(cartController.updateCartItem);

////////////////////////////////////////////////////////////////
// Add Cart Item

router.route('/').post(cartController.addCartItem);

module.exports = router;
