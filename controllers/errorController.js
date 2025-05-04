// ERROR-HANDLING MIDDLEWARE - rec-zed by 4 parameters
module.exports = (err, req, res, next) => {
  // tells us where the line error happened
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
