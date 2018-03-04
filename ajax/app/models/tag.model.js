var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Schema = mongoose.Schema;

var TagSchema = new Schema({
    title:       { type: String, required: true },
});

module.exports = mongoose.model('Tag', TagSchema);