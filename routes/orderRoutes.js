const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('./../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router();

router.use(authController.protect);

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
  .put(
    authController.restrictTo('admin', 'manager'),
    orderController.updateOrderToPaid
  );

router
  .route('/:id/deliver')
  .put(
    authController.restrictTo('admin', 'manager'),
    orderController.updateOrderToDelivered
  );

////////////////////////////////////////////////////////////////
// Customer Order Routes
router
  .route('/myOrders')
  .get(orderController.getMe, orderController.getAllOrders);

router
  .route('/myOrders/:id')
  .get(orderController.getMe, orderController.getOrder);

router.route('/:cartId/').post(orderController.createOrder);

module.exports = router;
