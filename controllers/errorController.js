const { JsonWebTokenError } = require('jsonwebtoken');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsErrorDB = (err) => {
  const value = err.keyValue.name;
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errorMessages = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid Input Data: ${errorMessages.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token! Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational, trusted error: send msg to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error
    // console.error('💥 ERROR:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// ERROR-HANDLING MIDDLEWARE - rec-zed by 4 parameters
const globalErrorController = (err, req, res, next) => {
  // tells us where the line error happened
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // name is non-enumerable key
    let error = { ...err, name: err.name };

    // Get Tour: Invalid DB ID
    if (error.name === 'CastError') error = handleCastErrorDB(error);

    // Create Tour: Duplicate doc name
    if (error.code === 11000) error = handleDuplicatedFieldsErrorDB(error);

    // Update Tour: Invalid input data
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorController;
