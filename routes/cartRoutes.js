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
  .delete(cartController.getMe, cartController.deleteCartItems);

router
  .route('/myCart/:id')
  .get(cartController.getMe, cartController.getCartItems)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

////////////////////////////////////////////////////////////////
// Rest of the Routes

router.route('/').post(cartController.addCartItem);

// router.route('/:id').get(cartController.getCartItems);

// router
//   .route('/:id/:cartItemId')
//   .patch(cartController.updateCartItem)
//   .delete(cartController.deleteCartItem);

module.exports = router;
