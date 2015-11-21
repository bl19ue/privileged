/**
 * Created by homeuser on 11/16/15.
 */
var express = require('express');
var router = express.Router();
var messages = require('../utils/messages');
var https = require("https");
//var databaseCalls = require('../utils/databaseCalls');
//var httpStatus = require('http-status-codes');
var unirest = require('unirest')

var mongoose = require('mongoose');
//var teamSchema=require('teamSchema');


router.get("/githubStats/:owner/:reponame",function(request,response,err){
    var options1 = {
        host: 'api.github.com',
        path: "/repos/"+request.params.owner+ "/"+ request.params.reponame +"/contributors" ,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };
    var options2 = {
        host: 'api.github.com',
        path: "/repos/"+request.params.owner+ "/"+ request.params.reponame +"/stats/code_frequency" ,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    };
    var options3 = {
        host: 'api.github.com',
        path: "/repos/"+request.params.owner+ "/"+ request.params.reponame +"/languages" ,
        method: 'GET',
        headers: {'user-agent': 'node.js'}
    }

    var reqCommits = https.request(options1, function(res){
        var commits=0;
        var commits_by_people='';
        res.on("data", function(chunk){
            commits_by_people += chunk;
        });
        res.on("end", function(){

            var commits_by_people_array=JSON.parse(commits_by_people);
            for(var i=0;i<commits_by_people_array.length;i++){
                //console.log("objects: "+JSON.stringify(commits_by_people_array[i]));
                commits+=commits_by_people_array[i].contributions;
            }
            //console.log("Body: ", body);
        });

        var reqLinesOfCode = https.request(options2, function(res2){
            var weekly_stats='';
            var lines_of_code=0;
            res2.on("data", function(chunk2){
                weekly_stats += chunk2;
                console.log("WeeklyStats: "+ weekly_stats);
            });

            res2.on("end", function(){
                var weekly_stats_array = JSON.parse(weekly_stats);
                console.log("BodyArray2: ", weekly_stats_array);
                for(var i=0;i<weekly_stats_array.length;i++){
                    console.log("objects2: "+JSON.stringify(weekly_stats_array[i]));
                    lines_of_code+=weekly_stats_array[i][1]+weekly_stats_array[i][2];
                }
                console.log("lines of code: "+lines_of_code);
                //console.log("Body: ", body);
            });

            var reqLanguages = https.request(options3, function(res3) {
                var languages = '';
                res3.on("data", function (chunk3) {
                    languages += chunk3;
                });
                res3.on("end", function () {
                    languages=JSON.parse(languages);
                    response.json({"commits": commits, "lines_of_code": lines_of_code, "languages": languages});
                    //console.log("Body: ", body);
                });
            })
            reqLanguages.end();
        })
        reqLinesOfCode.end();
    });
    reqCommits.end();
});

module.exports = router;