const express = require('express');
const productController = require('../controllers/productController');
const authController = require('./../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing
const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    productController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'manager'),
    productController.deleteProduct
  );

module.exports = router;
