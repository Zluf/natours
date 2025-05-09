const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// JWT secret should contain at least 32 chars
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // Would NOT verify user because expiresIn was sent as part of token
  // but we don't need that because we just sign i.e. creating new token for user
  // (creating new JWT = issuing new passport to a citizen)
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email & psw exist
  if (!email || !password) {
    return next(new AppError('Please provide email & password!', 400));
  }

  // 2) Check if user exists & psw is correct
  const user = await User.findOne({ email }).select('+password');

  // .correctPassword() is artificial method we created at authController
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password'), 401);
  }

  // 3) If all ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

module.exports = { signup, login };
