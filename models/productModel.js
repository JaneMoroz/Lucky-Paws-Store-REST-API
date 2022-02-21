const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        55,
        'A product name must have less or equal than 55 characters ',
      ],
      minlength: [
        5,
        'A product name must have more or equal than 5 characters ',
      ],
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation (doesnt work on UPDATE)
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    type: {
      type: String,
      required: [true, 'Choose a product type.'],
    },
    subType: {
      type: String,
      required: [true, 'Choose a product sub-type.'],
    },
    animal: {
      type: [String],
      required: [true, 'Specify a pet: cat, dog, or etc'],
    },
    style: [String],
    color: [String],
    features: [String],
    primaryImage: {
      type: String,
      required: [true, 'A product needs an image'],
    },
    otherImages: [String],
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
