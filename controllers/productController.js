const Product = require('./../models/productModel');
const factory = require('./handlerFactory');

////////////////////////////////////////////////////////////////
// Route handlers

// Get all products
exports.getAllProducts = factory.getAll(Product);

// Get product
exports.getProduct = factory.getOne(Product, { path: 'reviews' });

// Create product
exports.createProduct = factory.createOne(Product);

// Update product
exports.updateProduct = factory.updateOne(Product);

// Delete product
exports.deleteProduct = factory.deleteOne(Product);
