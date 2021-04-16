const mongoose = require('mongoose');
const intRange = (lower, upper, x) => Math.max(lower, Math.min(upper, Math.floor(x)));

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  pictureData: {
    type: Buffer,
    required: true,
  },
  quality: {
    type: Number,
    required: true,
    set: (value) => intRange(1, 3, value),
  },
  category: {
    type: String,
    required: true,
    enum: ['petting', 'resting', 'eating', 'playing'],
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model('Product', schema);

module.exports = Product;
