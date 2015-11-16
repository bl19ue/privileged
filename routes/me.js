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

router.get('/', ensureAuthorized, function(req, res) {
    databaseCalls.userDatabaseCalls.findUserByToken(req.token).done(function(obj) {
        response(obj, obj.type, res);
    });
});

/**
 * Compares two array and check if they are equal
 *
 * @param array1
 * @param array2
 * @returns {boolean}
 */
var compareArray = function(array1, array2) {
    if(array1.length !== array2.length) {
        return false;
    }

    for(var i=0;i<array1.length;i++) {
        if(array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Converts a single string into an array
 *
 * @param string
 * @returns {*}
 */
var convertToArray = function(string) {
    if(!string) {
        return [];
    }
    if(string.constructor !== Array) {
        var temp = [];
        temp.push(string);
        string = temp;
    }

    return string;
}

/**
 * Returns problem according to search by page number, caches when required
 */
router.get('/feeds/:page_num', ensureAuthorized, function(req, res) {
    var search = req.query.search;
    search = convertToArray(search);

    databaseCalls.redisCalls.findRequestByToken(req.token).done(function(obj) {
        //obj = JSON.parse(JSON.stringify(obj));
        obj = convertToArray(obj);
        if(obj && compareArray(obj, search)) {
            databaseCalls.redisCalls.findResultsByToken(req.token).done(function(obj) {
                //obj = JSON.parse(JSON.stringify(obj));
                var page_num = req.params.page_num;
                page_num = page_num * 10;
                if(page_num + 10 <= obj.length - 1) {
                    obj = obj.slice(page_num, page_num + 10);
                } else {
                    obj = obj.slice(page_num, obj.length);
                }
                for(var i=0;i<obj.length;i++) {
                    obj[i] = JSON.parse(obj[i]);
                }
                response(obj, httpStatus.OK, res);
            });
        } else {
            databaseCalls.userDatabaseCalls.findUserByToken(req.token).done(function(obj) {
                if(obj.type === httpStatus.OK) {
                    var interests = search || obj.data.interests;
                    databaseCalls.problemDatabaseCalls.findProblemByInterests(interests).done(function(obj) {
                        databaseCalls.redisCalls.saveRequestAndResult(interests, obj.data, req.token);
                        //For sending not more than 10 results
                        if(obj.data.length < 10) {
                            obj.data = obj.data.slice(0, obj.data.length);
                        } else {
                            obj.data = obj.data.slice(0, 11);
                        }
                        response(obj, obj.type, res);
                    });
                }
            });
        }
    });
});

/**
 * Returns single problem
 */
router.get('/problem/:problem_id', ensureAuthorized, function(req, res) {
    databaseCalls.problemDatabaseCalls.findProblemById(req.params.problem_id).done(function(obj) {
        response(obj, obj.type, res);
    });
});

/**
 * For creating a new problem
 */
router.post('/problem', ensureAuthorized, function(req, res) {
    var newProblem = new problemSchema(req.body);
    newProblem.date = new Date().toISOString();
    databaseCalls.problemDatabaseCalls.saveProblem(newProblem).done(function(obj) {
        response(obj, obj.type, res);
    });
});



module.exports = router;
