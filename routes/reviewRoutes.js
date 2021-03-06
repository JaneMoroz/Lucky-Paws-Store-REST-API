const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

////////////////////////////////////////////////////////////////
// General Review Routes
// All reviews can be only accessed by Admin, NEW review can be created only by User

router
  .route('/')
  .get(
    authController.restrictTo('admin', 'test'),
    reviewController.getAllReviews
  )
  .post(
    authController.restrictTo('user', 'test'),
    reviewController.setProductUserId,
    reviewController.createReview
  );

////////////////////////////////////////////////////////////////
// Customer Review Routes
router
  .route('/myReviews')
  .get(userController.getMe, reviewController.getAllReviews);

router
  .route('/myReviews/:id')
  .get(userController.getMe, reviewController.getReview);

////////////////////////////////////////////////////////////////
// Other Routes
router
  .route('/:id')
  .get(authController.restrictTo('admin'), reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  );

module.exports = router;
