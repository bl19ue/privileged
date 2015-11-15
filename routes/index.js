var express = require('express');
var router = express.Router();
var messages = require('../utils/messages');
var databaseCalls = require('../utils/databaseCalls');
var httpStatus = require('http-status-codes');

var q = require('q');

var jwt = require("jsonwebtoken");

var mongoose = require('mongoose');
var userSchema = mongoose.model('user');

var response = function(message, status, res) {
    res.status(status).send(message);
};

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/**
 * Authenticates a user by email and password (signin)
 *
 * body: email, password
 */
router.post('/authenticate', function(req, res) {
    databaseCalls.userDatabaseCalls.findUserByEmail(req.body.email, req.body.password).done(function(obj) {
        response(obj, obj.type, res);
    });
});

/**
 * New user registeration
 *
 * body: email, password
 */
router.post('/register', function(req, res) {
    databaseCalls.userDatabaseCalls.findUserByEmail(req.body.email, req.body.password).done(function(obj) {
        if(obj.type === httpStatus.NOT_FOUND) {
            var newUser = new userSchema(req.body);
            newUser.token = jwt.sign(newUser, "secret");
            databaseCalls.userDatabaseCalls.saveUser(newUser).done(function(obj) {
                response(obj, obj.type, res);
            });
        } else {
            response(obj, obj.type, res);
        }
    });
});

process.on('uncaughtException', function(err) {
    console.log("Error:" + err);
});

router.get('/index', function(req, res, next) {
  res.render('app', { title: 'Privileged4All' });
});

module.exports = router;
