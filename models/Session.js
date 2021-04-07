const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },  
});

const Session = mongoose.model('Session', schema);

module.exports = Session;
