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
    console.error('💥 ERROR:', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// ERROR-HANDLING MIDDLEWARE - rec-zed by 4 parameters
module.exports = (err, req, res, next) => {
  // tells us where the line error happened
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if ((process.env.NODE_ENV = 'production')) {
    sendErrorProd(err, res);
  }
};
