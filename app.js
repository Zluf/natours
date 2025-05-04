const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');

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

// CATCH-ALL MW
// for all HTTP methods (GET, POST, PUT, DELETE, etc.)
// and any routes that have not been explicitly defined in the application.
app.all('*', (req, res, next) => {
  // 1st Way
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't inject ${req.originalUrl} on this server!`,
  // });

  // 2nd Way
  // const err = new Error(`Can't inject ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // anything passed to next() is an error
  // it will skip all further middleware
  // and get straight into error-handling middleware
  // next(err);

  // 3rd Way
  next(new AppError(`Can't inject ${req.originalUrl} on this server!`, 404));
});

// ERROR-HANDLING MIDDLEWARE - rec-zed by 4 parameters
app.use(globalErrorController);

module.exports = app;
