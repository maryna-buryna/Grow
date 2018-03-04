'use strict';

var Tag          = require('./../models/tag.model');
var Article      = require('./../models/article.model');
var notification = require('./../service/notification.service');


var TagCtrl = {

    getTags: function(req, res) {
        return Tag.find(function(err, tags) {
            if (!err) {
                return res.send(tags);
            } else {
                notification.serverErr(res)
            }
        });
    },

    postTag: function(req, res) {
        var tag = new Tag({
            title: req.body.title,
        });

        tag.save(function(err) {
            if (!err) {
                console.log("tag created");
                return res.send({ status: 'OK', tag: tag });
            } else {
                if (err.name == 'ValidationError') {
                    notification.validationErr(res);
                } else {
                    notification.serverErr(res);
                }
            }
        });
    },


    getTag: function(req, res) {
        return Tag.findById(req.params.id, function(err, tag) {
            if (!tag) {
                notification.notFound(res);
            }
            if (!err) {
                return res.send({ status: 'OK', tag: tag });
            } else {
                notification.serverErr(res);
            }
        });
    },

    updateTag: function(req, res) {
        return Tag.findById(req.params.id, function(err, tag) {
            if (!tag) {
                notification.notFound(res);
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
                        notification.validationErr(err);
                    } else {
                        notification.serverErr(res);
                    }
                }
            });
        });
    },


    setOptions: function(req, res) {
        res.send();
    },


    deleteTag: function(req, res, next) {
        return Tag.findById(req.params.id, function(err, tag) {
            if (!tag) {
                notification.notFound(res);
            }
            return tag.remove(function(err) {
                if (!err) {                    
                    next();
                } else {
                    notification.serverErr(res)
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
    

    setHeaders: function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        next();
    }

}

module.exports = TagCtrl;
