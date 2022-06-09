const User = require('./../models/userModel');
const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

////////////////////////////////////////////////////////////////
// Image Upload

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

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
  console.log(req.user.id);
  req.params.userId = req.user.id;
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
  if (req.file) filteredBody.photo = req.file.filename;

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
