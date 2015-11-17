var express = require('express');
var router = express.Router();
var messages = require('../utils/messages');
var databaseCalls = require('../utils/databaseCalls');
var httpStatus = require('http-status-codes');

var q = require('q');

var jwt = require("jsonwebtoken");

var mongoose = require('mongoose');
var problemSchema = mongoose.model('problem');
var userSchema = mongoose.model('user');

/**
 * Responds the user for any request
 *
 * @param message
 * @param status
 * @param res
 */
var response = function(message, status, res) {
    res.status(status).send(message);
};

/**
 * A middleware to intercept important APIs and check if token exists or not.
 *
 * @param req
 * @param res
 * @param next
 */
var ensureAuthorized = function(req, res, next) {
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        req.token = bearer[0];
        next();
    } else {
        var message = "Not authorized";
        response(message, httpStatus.FORBIDDEN, res);
    }
};

/**
 * Returns the comments of the post
 */
router.get('/:post_id/comments', ensureAuthorized, function(req, res) {
    databaseCalls.commentsDatabaseCalls.findCommentsByPostId(req.params.post_id).done(function(obj) {
        response(obj, obj.type, res);
    });
});

/**
 * Adds a new comment to the post
 */
router.post('/:post_id/comments', ensureAuthorized, function(req, res) {
    var post_id = req.params.post_id,
        owner = req.body.owner,
        description = req.body.description;

    databaseCalls.commentsDatabaseCalls.saveCommentForPost(post_id, owner, description).done(function(obj) {
        response(obj, obj.type, res);
    });
});

module.exports = router;