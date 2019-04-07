const mongoose = require('mongoose');


var Schema = mongoose.Schema;
var urlSchema = new Schema({
  url: {type: String, required: true},
  number: {type: Number, required: true, default: 0}
});

module.exports = mongoose.model('urls', urlSchema);
