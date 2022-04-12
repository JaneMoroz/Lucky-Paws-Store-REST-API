const mongoose = require('mongoose');

// Cart Item Schema
const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    productId: String,
    style: String,
    color: String,
    quantity: Number,
    purchasePrice: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    priceWithTax: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;

// Cart Schema
const CartSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now,
    },
    ordered: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate product Middleware
CartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.product',
    select: 'name primaryImage slug',
  });
  next();
});

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;
