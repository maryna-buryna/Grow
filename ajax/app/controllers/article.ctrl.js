'use strict';

var Article = require('./../models/article.model');
var Tag    = require('./../models/tag.model');


var articleCtrl = {

    getArticles: function(req, res) {
        return Article.find(function(err, articles) {
            if (!err) {
                return res.send(articles);
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    },

    postArticle: function(req, res) {
        console.log(req.body)
        var article = new Article({
            title:       req.body.title,
            author:      req.body.author,
            description: req.body.description,
            images:      req.body.images,
            tags:        req.body.tags
        });

        article.save(function(err) {
            if (!err) {
                console.log("article created");
                return res.send({ status: 'OK', article: article });
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

    getArticle: function(req, res) {
        return Article.findById(req.params.id, function(err, article) {
            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            if (!err) {
                return res.send({ status: 'OK', article: article });
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({ error: 'Server error' });
            }
        });
    },

    updateArticle: function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "PUT");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        return Article.findById(req.params.id, function(err, article) {

            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }

            for (let key in req.body) {
                article[key] = req.body[key];
            }

            return article.save(function(err) {
                if (!err) {
                    console.log("article updated");
                    return res.send({ status: 'OK', article: article });
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
        return res.send();
    },

    deleteArticle: function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "DELETE");
        return Article.findById(req.params.id, function(err, article) {
            if (!article) {
                res.statusCode = 404;
                return res.send({ error: 'Not found' });
            }
            return article.remove(function(err) {
                if (!err) {
                    console.log("article removed");
                    return res.send({ status: 'OK' });
                } else {

                    res.statusCode = 500;
                    console.log('Internal error(%d): %s', res.statusCode, err.message);
                    return res.send({ error: 'Server error' });
                }
            });
        });
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

module.exports = articleCtrl;
