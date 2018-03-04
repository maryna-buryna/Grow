'use strict';

var Article      = require('./../models/article.model');
var Tag          = require('./../models/tag.model');
var notification = require('./../service/notification.service');


var articleCtrl = {

    getArticles: function(req, res) {
        return Article.find(function(err, articles) {
            if (!err) {
                return res.send(articles);
            } else {
                notification.serverErr(res);
            }
        });
    },


    getArticlesByTag: function(req, res) {
        return Article.find(function(err, articles) {
            if (!err) {
                let resArticles = []
                for (let article of articles) {
                    let tagId = req.params.id;
                
                    article.tags.find ((el, index) => {
                        if (el == req.params.id ) {
                            resArticles.push(article);
                        }
                    })
                }    
                return res.send(resArticles);
            } else {
                notification.serverErr(res);
            }
        });
    },


    postArticle: function(req, res) {
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
                if (err.name == 'ValidationError') {
                    notification.validationErr(res);
                } else {
                    notification.serverErr(res);
                }
            }
        });
    },


    getArticle: function(req, res) {
        return Article.findById(req.params.id, function(err, article) {
            if (!article) { 
                notification.notFound(res) 
            }
            if (!err) {
                return res.send({ status: 'OK', article: article });
            } else {
                notification.serverErr(res);
            }
        });
    },


    setOptions: function(req, res) {
        return res.send();
    },


    updateArticle: function(req, res) {
        return Article.findById(req.params.id, function(err, article) {
            if (!article) {
                notification.notFound(res)
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
                        notification.validationErr(res);
                    } else {
                        notification.serverErr();
                    }
                }
            });
        });
    },


    deleteArticle: function(req, res) {
        return Article.findById(req.params.id, function(err, article) {
            if (!article) {
                notification.notFound(res)
            }
            return article.remove(function(err) {
                if (!err) {
                    console.log("article removed");
                    notification.goodRequest(res);
                } else {
                    notification.serverErr(res);
                }
            });
        });
    },


    setHeaders: function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    }

}

module.exports = articleCtrl;
