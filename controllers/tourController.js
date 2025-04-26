const fs = require('fs');
const Tour = require('../models/tourModel');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

const checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Bad request: missing name or price',
    });
  }
  next();
};

const getAllTours = async (req, res) => {
  // ▪ BUILD QUERY
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  console.log(req.query, queryObj);

  const query = Tour.find(queryObj);

  // ▪ Filter way #1
  // const query = await Tour.find({
  //   difficulty: 'easy',
  //   duration: 5,
  // });

  // ▪ Filter way #2
  // const query = await Tour.find()
  // .where('duration')
  // .equals(5)
  // .where('difficulty')
  // .equals('easy');

  // ▪ EXECUTE QUERY

  const tours = await Tour.find(req.query);

  // ▪ SEND RESPONSE
  try {
    res.status(200).json({
      message: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `Error getting all tours: ${err}`,
    });
  }
};

// Would have :id in req.params
const getTour = async (req, res) => {
  try {
    // shorthad for Tour.findOne({ _id: req.params.id })
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      message: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Create new document in db from input of req.body
// * new ID automatically added upon creation
const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// req.body will only replace the addressed field, all else in doc stays the same
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true, // validate the update operation against the model's schema
    });
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: null,
      message: `${tour.name} deleted!`,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkBody,
};
