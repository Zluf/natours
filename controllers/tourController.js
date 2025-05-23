const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request: missing name or price',
    });
  }
  next();
};

const aliasTopTours = async (req, res, next) => {
  // we don't need to send response
  // the query fields will be processed by getAllTours
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const getAllTours = catchAsync(async (req, res, next) => {
  // Here we declare what we want to fetch
  // to then chain all kinds of query methods
  // (we don't yet return the promise)
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Here we actually return the promise
  const tours = await features.query;
  // All the above could be replaced by just const tours = await Tour.find() which
  // just fetch all the tour entries (documents) but we want things more elaborate

  // ▪ SEND RESPONSE
  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: { tours },
  });
});

// Would have :id in req.params
const getTour = catchAsync(async (req, res, next) => {
  // shorthad for Tour.findOne({ _id: req.params.id })
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    console.log('no tour found');
    // always has to be returned, otherwise 2 responses will be sent
    return next(new AppError('No tour found with this ID!', 404));
  }

  res.status(200).json({
    message: 'success',
    data: { tour },
  });
});

// Create new document in db from input of req.body
// * new ID automatically added upon creation
const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
});

// req.body will only replace the addressed field, all else in doc stays the same
const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true, // validate the update operation against the model's schema
  });
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    // always has to be returned, otherwise 2 responses will be sent
    return next(new AppError('No tour found with this ID!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: null,
    message: `${tour.name} deleted!`,
  });
});

// ▪️ AGGREGATION PIPELINE #1
// performs calculations on specified fields
const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingsAverage: { $gte: 4.5 },
      },
    },
    {
      $group: {
        // calculates averages in one big unsorted group
        // _id: null,

        // performs calc-s on all instances of difficulty
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 }, // adds if more than 1 match
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    { $sort: { avgPrice: 1 } }, // 1 for ascenting
    // { $match: { _id: { $ne: 'EASY' } } }, // $ne = not equals
  ]);
  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// AGGRGATION PIPELINE #2
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;
  const plan = await Tour.aggregate([
    // $unwind works with arrays, it takes each value
    // and outputs the parent document for each of these values
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }, // makes an array and adds tour names to it
      },
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: -1 } },
    { $limit: 6 },
  ]);

  res.status(200).json({
    status: 'success',
    results: plan.length,
    data: { plan },
  });
});

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
};
