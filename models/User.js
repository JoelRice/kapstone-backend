const mongoose = require('mongoose');
const intRange = (lower, upper, x) => Math.max(lower, Math.min(upper, Math.floor(x)));

const Item = new mongoose.Schema({
  name: {
    type: String,
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
});

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  inventory: {
    type: [Item],
  },
});

// Cleanup functions
schema.pre('remove', { document: true, query: false }, function(next) {
  mongoose.model('Session').deleteMany({ user: this._id }, next);
});

// Mainly for findByIdAndDelete which is really findOneAndDelete so I used a regex
schema.pre(/.*delete.*/i, { document: false, query: true }, function(next) {
  mongoose.model('Session').deleteMany({ user: this._conditions._id }, next);
});

const User = mongoose.model('User', schema);

module.exports = User;
