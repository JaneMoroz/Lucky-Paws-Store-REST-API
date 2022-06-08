const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('./../controllers/authController');
const viewController = require('./../controllers/viewController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router();

router.use(authController.protect);
////////////////////////////////////////////////////////////////
// Stripe

router.get('/checkout-session/:cartId/', orderController.getCheckoutSession);

////////////////////////////////////////////////////////////////
// Customer Order Routes
router
  .route('/myOrders')
  .get(authController.getMe, orderController.getAllOrders);

router
  .route('/myOrders/:id')
  .get(authController.getMe, orderController.getOrder);

router.route('/:cartId/').post(orderController.createOrder);

////////////////////////////////////////////////////////////////
// Admin/ Manager Order Routes
router
  .route('/:id')
  .get(authController.restrictTo('admin', 'manager'), orderController.getOrder);

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'manager'),
    orderController.getAllOrders
  );

// Change order status routes
router
  .route('/:id/pay')
  .patch(
    authController.restrictTo('admin', 'manager'),
    orderController.updateOrderToPaid
  );

router
  .route('/:id/deliver')
  .patch(
    authController.restrictTo('admin', 'manager'),
    orderController.updateOrderToDelivered
  );

module.exports = router;
