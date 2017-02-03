'use strict';

var Tag    = require('./../models/tag.model');
var Article    = require('./../models/article.model');


var TagCtrl = {

    getTags: function(req, res) {
        return Tag.find(function(err, tags) {
            if (!err) {
                return res.send(tags);
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    },

    postTag: function(req, res) {
        console.log(req.body)
        var tag = new Tag({
            title: req.body.title,
        });

        tag.save(function(err) {
            if (!err) {
                console.log("tag created");
                return res.send({ status: 'OK', tag: tag });
            } else {
                console.log(err);
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                console.log('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    },

    getTag: function(req, res) {
        return Tag.findById(req.params.id, function(err, tag) {
            if (!tag) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            if (!err) {
                return res.send({ status: 'OK', tag: tag });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    },

    updateTag: function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        return Tag.findById(req.params.id, function(err, tag) {

            if (!tag) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            for (let key in req.body) {
                tag[key] = req.body[key];
            }

            return tag.save(function(err) {
                if (!err) {
                    console.log("tag updated");
                    return res.send({ status: 'OK', tag: tag });
                } else {
                    if (err.name == 'ValidationError') {
                        res.statusCode = 400;
                        res.send({ error: 'Validation error' });
                    } else {
                        res.statusCode = 500;
                        res.send({ error: 'Server error' });
                    }
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                }
            });
        });
    },

    setOptions: function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "DELETE, PUT, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.send();
    },

    deleteTag: function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "DELETE");
        return Tag.findById(req.params.id, function(err, tag) {
            if (!tag) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            return tag.remove(function(err) {
                if (!err) {                    
                    next();
                } else {
                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        });
    },
    
        deleteTagFromArticle: function (req, res) {
         Article
            .find({})
            .then((arr) => {   
                for (let article of arr) {
                    let index = article.tags.indexOf(req.params.id);
                    if (index > -1) {
                        article.tags.splice(index, 1);
                        article.save()
                    }
                }
                return res.send({ status: 'OK'})               
            })
    },
    
    
    notFound: function(req, res, next) {
        res.status(404);
        res.send({ error: 'Not found' });
        return;
    },

    internalError: function(err, req, res, next) {
        res.status(err.status || 500);
        res.send({ error: err.message });
        return;
    },

    setHeaders: function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    }

}

module.exports = TagCtrl;
