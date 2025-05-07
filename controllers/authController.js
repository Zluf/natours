const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

const signup = catchAsync(async (req, res, next) => {
  console.log('signup 1');
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { user: newUser },
  });
});

// const createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: { tour: newTour },
//   });
// });

module.exports = { signup };
