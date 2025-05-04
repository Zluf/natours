const mongoose = require('mongoose');
const dotenv = require('dotenv');

// catches sync code errors (e.g undefined)
// has to be at very top of app
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB database
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// console.log(app.get('env'));
// console.log(process.env.NODE_ENV); // process is Node core module

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// catches unhandled errors in async code (e.g fail to connect to DB)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');

  // we're letting server finish processing all requests
  // before it gets shut down
  server.close(() => process.exit(1));
});
