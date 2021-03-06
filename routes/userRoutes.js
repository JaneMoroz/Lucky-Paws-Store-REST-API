const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

////////////////////////////////////////////////////////////////
// Routing

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protects all routes which come after
router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  authController.restrictTo('admin', 'manager', 'user'),
  authController.updatePassword
);
router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',
  authController.restrictTo('admin', 'manager', 'user'),
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router
  .route('/')
  .get(authController.restrictTo('admin', 'test'), userController.getAllUsers);

// Restricts all routes which come after
router.use(authController.restrictTo('admin'));

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
