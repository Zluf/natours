const express = require('express');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// ▶️ MIDDLEWAREs
/** Would intercept and inject itself in every route below
 * but not above. Placement of MW in the code matters
 */

app.use(morgan('dev')); // MW logs req info

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋🏼');
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json()); // MW for adding body to requests

// ▶️ ROUTEs

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
