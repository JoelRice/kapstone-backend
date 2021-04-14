const mongoose = require('mongoose');
const intRange = (lower, upper, x) => Math.max(lower, Math.min(upper, Math.floor(x)));

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pictureData: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  traits: {
    cuddly: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 5, value),
    },
    lazy: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 5, value),
    },
    hungry: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 5, value),
    },
    energetic: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 5, value),
    },
    loyal: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 5, value),
    },
  },
  stats: {
    tired: {
      type: Number,
      required: true,
      set: (value) => intRange(1, 8, value),
    },
    trusting: {
      type: Number,
      required: true,
      set: (value) => Math.max(1, Math.floor(value)),
    },
  },
});

const Pet = mongoose.model('Pet', schema);

module.exports = Pet;
