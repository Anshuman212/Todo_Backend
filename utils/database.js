const mongoose = require('mongoose');
require('dotenv').config();
const { MONGO_URI } = process.env;

mongoose.connect(String(MONGO_URI))
  .then(() => {
    console.log('Connected to the database');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

module.exports = mongoose;
