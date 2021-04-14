const mongoose = require('mongoose');

const Bid = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const schema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true,
  },
  endsAt: {
    type: Date,
    required: true,
  },
  bids: {
    type: [Bid],
  },
});

const Auction = mongoose.model('Auction', schema);

module.exports = Auction;
