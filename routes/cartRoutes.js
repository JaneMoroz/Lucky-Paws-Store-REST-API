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
  .get(cartController.getMe, cartController.getCarts)
  .post(cartController.createCart)
  .delete(cartController.deleteCart);

router.route('/myCart/:id').get(cartController.getMe, cartController.getCart);

router.route('/myCart/:id/:cartItemId').patch(cartController.updateCartItem);

////////////////////////////////////////////////////////////////
// Add Cart Item

router.route('/').post(cartController.addCartItem);

// router.route('/:id').get(cartController.getCartItems);

// router
//   .route('/:id/:cartItemId')
//   .patch(cartController.updateCartItem)
//   .delete(cartController.deleteCartItem);

module.exports = router;
