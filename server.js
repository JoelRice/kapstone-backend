require('dotenv-safe').config();
const express = require('express');
const mongoose = require('mongoose');

const { DATABASE, PORT } = process.env;

const server = express();
server.use(express.json());

// Connect to database
mongoose.connect(DATABASE, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});

mongoose.connection.on('error', (err) => {
  console.log(`Could not connect to MongoDB: ${err}`);
});

// Deal with headers
server.use((req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  });

  if (!req.path.includes('/admin') && req.get('Content-Type') !== undefined && req.get('Content-Type') !== 'application/json') {
    res.status(400).json({ error: '\'Content-Type\' header should be \'application/json\'' });
    return;
  }
  
  next();
});

// Create endpoints
server.use(require('./handlers/endpoints'));

// Fallback on no endpoint
server.use((req, res) => {
  res.status(404).send({ error: 'Incorrect endpoint or request method' });
});

// Create timeouts
require('./handlers/timeouts').init();

server.listen(PORT, () => {
  console.log(`Express running on port ${PORT}`);
});
