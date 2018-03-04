'use strict';

var notification = {

    serverErr: function (res) {
        res.status(500).send({status: '500', message: "Server error!"});
    },

    notFound: function (res) {
        res.status(404).send({status: '404', message: "Not found"})
    },

    validationErr: function (res) {
        return res.status(400).send({status: '400', message: "Validation error!"});
    },

    goodRequest: function (res) {
        return res.status(200).send({status: '200', message: 'successful'})
    }

};

module.exports = notification;

