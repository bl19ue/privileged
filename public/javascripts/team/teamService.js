/**
 * Created by ashishnarkhede on 11/24/15.
 */
(function () {
    'use strict';

    angular
        .module('myApp')
        //upload service for file uploads
        .factory('teamService', teamService);

    teamService.$inject = ['$http', '$localStorage'];

    function teamService($http, $localStorage){

        var teamObject = {
            team: ''
        };

        teamObject.getSignedS3Request = getSignedS3Request;
        teamObject.joinTeam = joinTeam;
        teamObject.postComment = postComment;

        /**
         * This method gets the signed s3 request from the server
         *
         * @param file object
         * @returns {*|{get}}
         */
        function getSignedS3Request(file) {

            var url = 'http://localhost:3000/upload/sign_request?filename=' + file.name + '&filetype=' + file.type;
            // just return the call, use then in controller
            return $http.get(url);
        }

        /**
         * Join a team
         * @param team
         * @returns {*}
         */
        function joinTeam(team) {
            var url = '/me/problem/' + team.problem._id + '/teams/' + team._id + '/join';
            var header = {authorization: $localStorage.user.token};
            return $http({
                method: 'post',
                url: url,
                headers: header,
                data: team
            });
        }

        /**
         * Post a comment
         */
        function postComment(teamId, comment) {
            var url = "";
        }

        return teamObject;
    }
})();