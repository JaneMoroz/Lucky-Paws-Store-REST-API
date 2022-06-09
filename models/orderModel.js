const mongoose = require('mongoose');

// Order Schema
const OrderSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    shippingAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    updated: Date,
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Populate order middleware
OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'cart',
    select: 'products subtotal taxes shippingPrice total',
  }).populate({
    path: 'user',
    select: 'name',
  });
  next();
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
