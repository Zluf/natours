const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  // JWT secret should contain at least 32 chars
  // Would NOT verify user because expiresIn was sent as part of token
  // but we don't need that because we just sign i.e. creating new token for user
  // (creating new JWT = issuing new passport to a citizen)
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

module.exports = { signup };
