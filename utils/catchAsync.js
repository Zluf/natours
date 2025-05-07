module.exports = (fn) => {
  // The returned anonym func is recognized as MW
  // bc we pass the 3 MW-specific arguments to it
  return (req, res, next) => {
    console.log('catchAsync');
    fn(req, res, next).catch((err) => next(err));
  };
};
