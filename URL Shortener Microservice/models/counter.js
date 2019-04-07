const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var counterSchema = new Schema({
  type: {type: String, required: true, default: "urlsCounter"},
  number: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('counter', counterSchema);