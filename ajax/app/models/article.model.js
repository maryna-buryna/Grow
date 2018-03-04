var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title:       { type: String, required: true },
    author:      { type: String, required: true },
    description: { type: String, required: true },
    images:      { type: String, required: true },
    modified:    { type: Date, default: Date.now },
    tags:        [ { type: Schema.Types.ObjectId, ref: 'Tags'} ]
});

module.exports = mongoose.model('Article', ArticleSchema);