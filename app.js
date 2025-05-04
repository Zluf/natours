const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// ▶️ MIDDLEWAREs
/** Would intercept and inject itself in every route. Placement of MW in the code matters */

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// MW logs req info
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// MW for adding body to requests
app.use(express.json());

// MW that serves files in public folder
// ("/public" should not be added in url)
app.use(express.static(`${__dirname}/public`));

// ▶️ ROUTEs

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't inject ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't inject ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  // anything passed to next() is an error
  // it will skip all further middleware
  // and get straight into error-handling middleware
  next(err);
});

// ERROR-HANDLING MIDDLEWARE - rec-zed by 4 parameters
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
