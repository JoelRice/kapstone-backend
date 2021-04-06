require('dotenv-safe').config();
const express = require('express');
const mongoose = require('mongoose');

const { DATABASE, PORT } = process.env;

const server = express();
server.use(express.json());

mongoose.connect(DATABASE);

mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});

mongoose.connection.on('error', (err) => {
  console.log(`Could not connect to MongoDB: ${err}`);
});

server.get('/', (req, res) => {
  res.send({ message: 'Hello, I am deployed.' });
});

server.listen(PORT, () => {
  console.log(`Express running on port ${PORT}`);
});
