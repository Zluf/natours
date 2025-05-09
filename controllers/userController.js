const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  // All the above could be replaced by just const users = await Tour.find() which
  // just fetch all the tour entries (documents) but we want things more elaborate

  // ▪ SEND RESPONSE
  res.status(200).json({
    message: 'success',
    results: users.length,
    data: { users },
  });
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
