const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('./../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').post(cartController.addCartItem);
router
  .route('/:id')
  .get(cartController.getCartItems)
  .delete(cartController.deleteCartItems);

router
  .route('/:id/:cartItemId')
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

module.exports = router;
