const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema(
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
      required: true,
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;

// Cart Schema
const cartSchema = new mongoose.Schema(
  {
    products: [cartItemSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    taxes: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
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
cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'products.product',
    select: 'name primaryImage slug',
  });
  next();
});

// Calculate subtotal, taxes, total
cartSchema.pre('save', function (next) {
  const cartItemsSubtotalArr = this.products.map(
    (product) => product.quantity * product.purchasePrice
  );
  this.subtotal = cartItemsSubtotalArr.reduce((a, b) => a + b, 0).toFixed(2);
  this.taxes = (this.subtotal * 0.1).toFixed(2);
  const totalAfterTaxes = this.subtotal + this.taxes;
  this.shippingPrice = totalAfterTaxes > 100 ? 0 : 20;
  this.total = totalAfterTaxes + this.shippingPrice;

  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
