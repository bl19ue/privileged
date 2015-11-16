var messages = require('./messages');

var mongoose = require('mongoose');
var problemSchema = mongoose.model('problem');
var userSchema = mongoose.model('user');
var postSchema = mongoose.model('post');
var teamSchema = mongoose.model('team');
var commentSchema = mongoose.model('comment');

var httpStatus = require('http-status-codes');
var q = require('q');

var redis = require('redis');
var cache = redis.createClient();

var ObjectId = require('mongoose').Types.ObjectId;

/**
 * User model database calls
 *
 * @type {{findUserByToken: Function, findUserByEmail: Function, saveUser: Function}}
 */
var userDatabaseCalls = {
    /**
     * Calls mongoDB server to find a user by his token.
     *
     * @param token
     * @returns {*|promise}
     */
    findUserByToken : function(token) {
        var deferred = q.defer();
        var object = {};
        userSchema.findOne({ token: token}, function(err, user) {

            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(user) {
                object.isError = false;
                object.data = user;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.USER_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    },

    /**
     * Calls mongoDB server to find a user by his email and password.
     *
     * @param email
     * @param password
     * @returns {*}
     */
    findUserByEmail : function(email, password) {
        var deferred = q.defer();
        var object = {};
        userSchema.findOne({ email: email, password: password}, function(err, user) {

            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(user) {
                object.isError = false;
                object.data = user;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.USER_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    },

    /**
     * Save user
     *
     * @param user
     * @param res
     */
    saveUser : function(user) {
        var deferred = q.defer();
        var object = {};
        user.save(function(err, user) {
            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(user) {
                object.isError = false;
                object.message = messages.SAVED_SUCCESSFULLY;
                object.data = user;
                object.token = user.token;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.CANNOT_SAVE;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    }
};

/**
 * Problem model database calls
 *
 * @type {{findProblemByInterests: Function, findProblemById: Function, saveProblem: Function}}
 */
var problemDatabaseCalls = {

    /**
     * Calls mongoDB server to find a problem by user's interests.
     *
     * @param interests
     * @returns {*|promise}
     */
    findProblemByInterests: function (interests) {
        var deferred = q.defer();
        var object = {};
        problemSchema.find({$or: [ {tools: {$in: interests}}, {technologies: {$in: interests}}]}, null, {limit: 200},
            function (err, problems) {

            if (err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if (problems) {
                object.isError = false;
                object.data = problems;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.ITEM_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    },

    /**
     * Find problem by it's id
     *
     * @param id
     * @returns {*}
     */
    findProblemById : function(id) {
        var deferred = q.defer();
        var object = {};
        problemSchema.findOne({_id: new ObjectId(id)}, function(err, problem) {
            if (err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if (problem) {
                object.isError = false;
                object.data = problem;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.ITEM_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });
        return deferred.promise;
    },

    /**
     * Saves a new problem
     *
     * @param problem
     * @returns {*|promise}
     */
    saveProblem : function(problem) {
        var deferred = q.defer();
        var object = {};
        problem.save(function(err, saved_problem) {
            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(saved_problem) {
                object.isError = false;
                object.message = messages.SAVED_SUCCESSFULLY;
                object.data = saved_problem;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.CANNOT_SAVE;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });

        return deferred.promise;
    }
};

/**
 * Post database calls
 * @type {{findPostsByProblemId: Function}}
 */
var postDatabaseCalls = {
    /**
     * Returns the posts of a problem
     *
     * @param problem_id
     * @returns {*}
     */
    findPostsByProblemId : function(problem_id) {
        var deferred = q.defer();
        var object = {};
        postSchema.find({problem: problem_id}, function(err, problems) {
            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(problems) {
                object.isError = false;
                object.data = problems;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.ITEM_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });
        return deferred.promise;
    }
};

/**
 * Comments database calls
 *
 * @type {{findCommentsByPostId: Function, saveCommentForPost: Function}}
 */
var commentsDatabaseCalls = {
    /**
     * Returns the comments of a single post
     *
     * @param post_id
     * @returns {*}
     */
    findCommentsByPostId : function(post_id) {
        var deferred = q.defer();
        var object = {};
        commentSchema.find({problem: post_id}, function(err, comments) {
            if(err) {
                object.isError = true;
                object.errorMessage = err;
                object.type = httpStatus.INTERNAL_SERVER_ERROR;
                deferred.resolve(object);
            } else if(comments) {
                object.isError = false;
                object.data = comments;
                object.type = httpStatus.OK;
                deferred.resolve(object);
            } else {
                object.isError = false;
                object.errorMessage = messages.ITEM_NOT_FOUND;
                object.type = httpStatus.NOT_FOUND;
                deferred.resolve(object);
            }
        });
        return deferred.promise;
    },

    /**
     * Adds a new comment to the post
     *
     * @param post_id
     * @param owner
     * @param description
     * @returns {*}
     */
    saveCommentForPost : function(post_id, owner, description) {
        var deferred = q.defer();
        var object = {};
        var newComment = {};
        commentSchema.findOne({post: post_id}, function(err, commentObj) {
            if(commentObj) {
                commentObj.comment.push({
                    owner: owner,
                    description: description
                });
                newComment = commentObj;
            } else {
                newComment = new commentSchema();
                newComment.post = post_id;
                newComment.comment = [];
                newComment.comment.push({
                    owner: owner,
                    description: description
                });
            }

            newComment.save(function(err, comment) {
                if(err) {
                    object.isError = true;
                    object.errorMessage = err;
                    object.type = httpStatus.INTERNAL_SERVER_ERROR;
                    deferred.resolve(object);
                } else if(comment) {
                    object.isError = false;
                    object.data = comment;
                    object.type = httpStatus.OK;
                    deferred.resolve(object);
                } else {
                    object.isError = false;
                    object.errorMessage = messages.ITEM_NOT_FOUND;
                    object.type = httpStatus.NOT_FOUND;
                    deferred.resolve(object);
                }
            });
        });
        return deferred.promise;
    }
};

var req = "request";
var res = "result";

/**
 * Redis caching methods
 *
 * @type {{findRequestByToken: Function, findResultsByToken: Function, saveRequestAndResult: Function}}
 */
var redisCalls = {
    /**
     * Finds requests based on the user's token
     * @param token
     * @returns {*}
     */
    findRequestByToken : function(token) {
        var deferred = q.defer();
        var object = {};

        cache.lrange(token + req, 0, -1, function(err, requests) {
            if(err) {
                object = null;
                deferred.resolve(object);
            } else {
                deferred.resolve(requests);
            }
        });

        return deferred.promise;
    },

    /**
     * Finds results based on the user's token
     *
     * @param token
     * @returns {*}
     */
    findResultsByToken : function(token) {
        var deferred = q.defer();
        var object = {};
        cache.lrange(token + res, 0, -1, function(err, results) {
            if(err) {
                object = null;
                deferred.resolve(object);
            } else {
                deferred.resolve(results);
            }
        });

        return deferred.promise;
    },

    /**
     * Caches the user's request and result in redis
     *
     * @param request
     * @param results
     * @param token
     */
    saveRequestAndResult : function(request, results, token) {
        console.log("req" + request);
        console.log("s" + JSON.stringify(request));
        var multi = cache.multi();

        for(var i=0;i<request.length;i++) {
            multi.rpush(token + req, request[i]);
        }

        for(var i=0;i<results.length;i++) {
            multi.rpush(token + res, JSON.stringify(results[i]._doc));
        }

        multi.exec(function(errors, results1) {});
    }
};

exports.userDatabaseCalls = userDatabaseCalls;
exports.problemDatabaseCalls = problemDatabaseCalls;
exports.redisCalls = redisCalls;
exports.postDatabaseCalls = postDatabaseCalls;
exports.commentsDatabaseCalls = commentsDatabaseCalls;