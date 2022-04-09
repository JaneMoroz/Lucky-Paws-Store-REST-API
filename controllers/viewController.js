const Product = require('./../models/productModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.getNewArrivals = catchAsync(async (req, res, next) => {
  // 1. Get Data
  // New Arrivals
  const newProd = new APIFeatures(Product.find(), {
    sort: '-created',
    limit: '4',
  })
    .sort()
    .paginate();

  let newArrivals = await newProd.query;

  // On Sale
  let onSaleProd = new APIFeatures(Product.find(), {
    priceDiscount: { gt: '0' },
    limit: '4',
  })
    .filter()
    .paginate();

  let onSale = await onSaleProd.query;

  // Brand Collection 1
  let coll1Prod = new APIFeatures(Product.find(), {
    brand: "Butcher's",
    limit: '3',
  })
    .filter()
    .paginate();

  let collection1 = await coll1Prod.query;

  // Brand Collection 2
  let coll2Prod = new APIFeatures(Product.find(), {
    brand: 'Diva',
    limit: '3',
  })
    .filter()
    .paginate();

  let collection2 = await coll2Prod.query;
  // 2. Build Template
  // 3. Render Template Using Data
  res.status(200).render('home', {
    title: 'Home',
    newArrivals,
    onSale,
    collection1,
    collection2,
  });
});
