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

  // - 1) Filtering
  const queryObj = { ...req.query };
  console.log('queryObj:', queryObj);
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach((el) => delete queryObj[el]);

  // - 2) Advanced filtering
  /** ...where we turn temporarily turn the query object into
   * string to add "$" to operators (>,>=,<,<=)
   */
  let queryStr = JSON.stringify(queryObj);
  console.log('queryStr:', queryStr);

  // Replace: /tours?duration[gte]=5 -> /tours?duration[$gte]=5
  // \b - match exacts words: "gte", "gt", "lte", "lt", not just part of word
  // g - all instances to be replaced
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  console.log('QUERY STR:', JSON.parse(queryStr));

  const query = Tour.find(JSON.parse(queryStr));

  // ▪ EXECUTE QUERY
  const tours = await query;

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
