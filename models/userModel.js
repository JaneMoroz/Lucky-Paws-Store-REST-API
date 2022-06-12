const crypto = require('crypto');
const mongoose = require('mongoose');

////////////////////////////////////////////////////////////////
// Validator
const validator = require('validator');

////////////////////////////////////////////////////////////////
// Bcrypt
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please, tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please, provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default-user.jpeg',
  },
  role: {
    type: String,
    enum: ['user'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please, provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please, provide a password'],
    validate: {
      // This only works on 'create a new user' and on SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

////////////////////////////////////////////////////////////////
// Encryption Middleware
userSchema.pre('save', async function (next) {
  // Run only if password was modified
  if (!this.isModified('password')) return next();

  // Has the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirmed field
  this.passwordConfirm = undefined;
});

////////////////////////////////////////////////////////////////
// Set passwordChangedAt property before saving
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000; // Not to get a bug, where token generates 1 millisecond before this property is set
  next();
});

////////////////////////////////////////////////////////////////
// Check password when the user is trying login
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

////////////////////////////////////////////////////////////////
// Check if password was changed after the token had been issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

////////////////////////////////////////////////////////////////
// Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
