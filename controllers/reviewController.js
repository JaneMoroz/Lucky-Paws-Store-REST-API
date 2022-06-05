const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.setProductUserId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  req.body.user = req.user.id;
  next();
};

////////////////////////////////////////////////////////////////
// Get "me" Middleware
exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
