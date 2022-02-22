const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

////////////////////////////////////////////////////////////////
// Helper function

// Get only fields we need from the object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

////////////////////////////////////////////////////////////////
// Get "me" Middleware
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

////////////////////////////////////////////////////////////////
// Route handlers

// User updates his/her data
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password updates, please use /updatePassword.',
        400
      )
    );

  // 2. Filtered our unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3. Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Get Users
exports.getAllUsers = factory.getAll(User);

// Get User
exports.getUser = factory.getOne(User);

// Update User (Admin)
exports.updateUser = factory.updateOne(User);

// Delete user
exports.deleteUser = factory.deleteOne(User);
