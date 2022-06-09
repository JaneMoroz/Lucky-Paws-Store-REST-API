const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const viewController = require('../controllers/viewController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router();

router.use(authController.protect);
////////////////////////////////////////////////////////////////
// Stripe

router.route('/checkout-session').post(orderController.getCheckoutSession);

////////////////////////////////////////////////////////////////
// Customer Order Routes
router
  .route('/myOrders')
  .get(userController.getMe, orderController.getAllOrders);

router
  .route('/myOrders/:id')
  .get(userController.getMe, orderController.getOrder);

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

router
  .route('/:id/deliver')
  .patch(
    authController.restrictTo('admin', 'manager'),
    orderController.updateOrderToDelivered
  );

module.exports = router;
