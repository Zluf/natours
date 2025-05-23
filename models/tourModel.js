const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
      maxlength: [40, 'A tour name must be less or equal to 40 characters'],
      minlength: [10, 'A tour name must be more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },

    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator:
          // this only points to current doc in new document creation
          function (val) {
            return val < this.price;
          },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
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

// DOCUMENT MIDDLEWARE: runs before save() and create() events
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document...');
//   next();
// });

// // DOCUMENT MIDDLEWARE (Pre-Save Hook):
// // runs after save() and create() events
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// in this case we keep secret tours secret from the user
// ^ - all the strings that start with <find>
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} miliseconds`);
  next();
});

// AGGREGAION MIDDLEWARE

tourSchema.pre('aggregate', function (next) {
  // excludes secret tours from aggregation calulations
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

// 2. Create a Model (eq. to Class) that enforces the Schema's requirements
const Tour = mongoose.model('Tour', tourSchema);
// Once Tour.create(object) is used a new "tours" db is created (if it didn't already exist)
// The passed name "Tour" is converted to "tours" collection in Mongo DB database

// 3. Create instance of a Model

// 4. Save instance as entry to database

module.exports = Tour;
