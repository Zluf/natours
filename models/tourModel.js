const mongoose = require('mongoose');

// ▶️ MONGOOSE WorkFlow

// 1. Create a Schema (eq. to TS interface)
// * if the input has fields not spec-d here, they will be ignored
// * new IDs are automatically added upon creation
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // removes all white space at start & end
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trime: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // permanently hides field from output
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual Properties - business logic to fatten the Model layer
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// 2. Create a Model (eq. to Class) that enforces the Schema's requirements
const Tour = mongoose.model('Tour', tourSchema);
// Once Tour.create(object) is used a new "tours" db is created (if it didn't already exist)
// The passed name "Tour" is converted to "tours" collection in Mongo DB database

// 3. Create instance of a Model

// 4. Save instance as entry to database

module.exports = Tour;
