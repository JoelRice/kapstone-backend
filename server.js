require('dotenv-safe').config();
const express = require('express');
const mongoose = require('mongoose');

const { DATABASE, PORT } = process.env;

const server = express();
server.use(express.json());

// Connect to database
mongoose.connect(DATABASE);

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

  if (req.get('Content-Type') !== undefined && req.get('Content-Type') !== 'application/json') {
    res.status(400).json({ error: '\'Content-Type\' header should be \'application/json\'' });
    return;
  }
  
  next();
});

// Create endpoints
server.use(require('./handlers/endpoints'));

server.listen(PORT, () => {
  console.log(`Express running on port ${PORT}`);
});
