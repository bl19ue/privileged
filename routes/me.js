var express = require('express');
var router = express.Router();
var messages = require('../utils/messages');
var databaseCalls = require('../utils/databaseCalls');
var httpStatus = require('http-status-codes');

var q = require('q');

var jwt = require("jsonwebtoken");

var mongoose = require('mongoose');
var problemSchema = mongoose.model('problem');
var teamSchema = mongoose.model('team');

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
 * Returns the user's profile
 */
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
 * A middleware to handle search parameter, if no search is passed from user, it will attach interests of that user.
 *
 * @param req
 * @param res
 * @param next
 */
var ensureInterestsOrSearch = function(req, res, next) {
    var search = req.query.search;
    if(search) {
        search = convertToArray(search);
        req.search = search;
        next();
    } else {
        databaseCalls.redisCalls.findInterestsByToken(req.token).done(function(interestObj) {
            if(interestObj.length > 0) {
                search = interestObj;
                search = convertToArray(search);
                req.search = search;
                next();
            } else {
                databaseCalls.userDatabaseCalls.findUserByToken(req.token).done(function(userObj) {
                    if(userObj.type === httpStatus.OK) {
                        search = userObj.data._doc.interests;
                        databaseCalls.redisCalls.saveUserInterests(req.token, search);
                        req.search = search;
                        next();
                    } else {
                        response(userObj, userObj.type, res);
                    }
                });
            }
        });
    }
}

/**
 * Checks redis for results to do pagination.
 *
 * @param req
 * @param res
 * @param next
 */
var checkRedis = function(req, res, next) {
    var search = req.search;
    databaseCalls.redisCalls.findRequestByToken(req.token).done(function(requestObj) {
        if(requestObj && compareArray(requestObj, search)) {
            databaseCalls.redisCalls.findResultsByToken(req.token).done(function(resultObj) {
                var page_num = req.params.page_num;
                page_num = page_num * 10;
                if(page_num + 10 <= resultObj.length - 1) {
                    resultObj = resultObj.slice(page_num, page_num + 10);
                } else {
                    resultObj = resultObj.slice(page_num, resultObj.length);
                }
                for(var i=0;i<resultObj.length;i++) {
                    resultObj[i] = JSON.parse(resultObj[i]);
                }
                response(resultObj, httpStatus.OK, res);
            });
        } else {
            next();
        }
    });
}

/**
 * Returns problem according to search by page number, caches when required
 */
router.get('/feeds/:page_num', ensureAuthorized, ensureInterestsOrSearch, checkRedis, function(req, res) {
    var search = req.search;
    databaseCalls.problemDatabaseCalls.findProblemBySearch(search).done(function(problemsObj) {
        databaseCalls.redisCalls.saveRequestAndResult(search, problemsObj.data, req.token);
        //For sending not more than 10 results
        if(problemsObj.data.length < 10) {
            problemsObj.data = problemsObj.data.slice(0, obj.data.length);
        } else {
            problemsObj.data = problemsObj.data.slice(0, 11);
        }
        response(problemsObj, problemsObj.type, res);
    });
});

/**
 * Returns single problem with it's post
 */
router.get('/problem/:problem_id', ensureAuthorized, function(req, res) {
    databaseCalls.problemDatabaseCalls.findProblemById(req.params.problem_id).done(function(obj) {
        databaseCalls.postDatabaseCalls.findPostsByProblemId(req.params.problem_id).done(function(problems_obj) {
            obj.problems = problems_obj;
            response(obj, obj.type, res);
        });
    });
});

/**
 * For creating a new problem
 */
router.post('/problem', ensureAuthorized, function(req, res) {
    var newProblem = new problemSchema(req.body);
    newProblem.problem_media.push(req.body.mediaurls);
    newProblem.date = new Date().toISOString();
    databaseCalls.problemDatabaseCalls.saveProblem(newProblem).done(function(obj) {
        response(obj, obj.type, res);
    });
});

/**
 * For getting all the teams working on this problem
 */
router.get('/problem/:problem_id/teams', ensureAuthorized, function(req, res) {
    databaseCalls.teamDatabaseCalls.findTeamsByProblemId(req.params.problem_id).done(function(teamsObj) {
        response(teamsObj, teamsObj.type, res);
    });
});

/**
 * For creating a new team under a problem
 */
router.post('/problem/:problem_id/teams', ensureAuthorized, function(req, res) {
    databaseCalls.userDatabaseCalls.findUserByToken(req.token).done(function(userObj) {
        if(userObj.type === httpStatus.OK) {
            var user = userObj.data;
            var newTeam = new teamSchema(req.body);
            newTeam.problem = req.params.problem_id;
            newTeam.owner = user._id;

            databaseCalls.teamDatabaseCalls.saveTeam(newTeam).done(function(teamObj) {
                response(teamObj, teamObj.type, res);
                var team = teamObj.data;

                databaseCalls.problemDatabaseCalls.findProblemById(team.problem).done(function(problemObj) {
                    var problem = problemObj.data;
                    problem.teams.push(team._id);
                    problem.people.push(team.owner);
                    databaseCalls.problemDatabaseCalls.saveProblem(problem);
                });

                databaseCalls.userDatabaseCalls.findUserById(user._id).done(function(savedUserObj) {
                    var savedUser = savedUserObj.data;
                    savedUser.problems_working.push(team.problem);
                    savedUser.teams_owned.push(team._id);
                    databaseCalls.userDatabaseCalls.saveUser(savedUser);
                });
            });
        } else {
            response(userObj, userObj.type, res);
        }
    });
});

/**
 * For joining a new team
 */
router.post('/problem/:problem_id/teams/:team_id/join', ensureAuthorized, function(req, res) {
    databaseCalls.teamDatabaseCalls.findTeamByTeamId(req.params.team_id).done(function(teamObj) {
        if(teamObj.type === httpStatus.OK) {
            var team = teamObj.data;
            databaseCalls.userDatabaseCalls.findUserByToken(req.token).done(function(userObj) {
                if(userObj.type === httpStatus.OK) {
                    var user = userObj.data;
                    user.problems_working.push(req.params.problem_id);
                    user.teams_working.push(team._id);

                    team.members.push(user._id);

                    databaseCalls.teamDatabaseCalls.saveTeam(team).done(function (savedTeamObj) {
                        response(savedTeamObj, savedTeamObj.type, res);
                    });

                    databaseCalls.problemDatabaseCalls.findProblemById(req.params.problem_id).done(function (problemObj) {
                        var problem = problemObj.data;
                        problem.members.push(user._id);
                        databaseCalls.problemDatabaseCalls.saveProblem(problem);
                    });
                } else {
                    response(userObj, userObj.type, res);
                }
            });
        } else {
            response(teamObj, teamObj.type, res);
        }
    });
});

module.exports = router;
