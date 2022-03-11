const mongoose = require('mongoose');

// Wishlist Schema
const WishlistSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

module.exports = Wishlist;
