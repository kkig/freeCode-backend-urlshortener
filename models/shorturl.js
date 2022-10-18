const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  original_url: {type: String, required: true, unique: true},
  short_url: Number,
  //   error: String,
});

module.exports = mongoose.model('Shorturl', urlSchema);
