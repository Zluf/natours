const mongoose = require('mongoose');

// ▶️ MONGOOSE WorkFlow

// 1. Create a Schema (eq. to TS interface)
// * if the input has fields not spec-d here, they will be ignored
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

// 4. Save instance as entry to database

module.exports = Tour;
