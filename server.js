const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// ▶️ MONGOOSE WorkFlow

// 1. Create a Schema (eq. to TS interface)
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// 2. Create a Model (eq. to Class) that enforces the Schema's requirements
const Tour = mongoose.model('Tour', tourSchema);

// 3. Create instance of a Model
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

// 4. Save instance as entry to database
testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('Error 💥:', err));

// console.log(app.get('env'));
console.log(process.env.NODE_ENV); // process is Node core module

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
