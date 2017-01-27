var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var morgan     = require('morgan')

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan(':method :url :status'))


var port = process.env.PORT || 1337;
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ajax');

console.log('start server on ' + port);
app.listen(port);

var articleRouter = require('./app/routers/article.router');
app.use('/api/articles', articleRouter);

var tagRouter = require('./app/routers/tag.router');
app.use('/api/tags', tagRouter);