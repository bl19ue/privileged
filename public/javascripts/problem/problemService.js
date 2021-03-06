/*** Created by ashishnarkhede on 11/19/15. ***/
(function () {
    'use strict';
    angular
        .module('myApp')
        .factory('problemService', problemService);

    problemService.$inject = ['$http', '$localStorage', '$state'];
    function problemService($http, $localStorage, $state){
        var problemObject = {
            problem: '',
            myProblemFeeds: []
        };

        problemObject.getSignedS3Request = getSignedS3Request;
        problemObject.submitProblem = submitProblem;
        problemObject.getProblem = getProblem;
        problemObject.myProblemList = myProblemList;
        problemObject.submitTeam = submitTeam;
        problemObject.getTeams = getTeams;


        /**
         * This method gets the signed s3 request from the server
         *
         * @param file object
         * @returns {*|{get}}
         */
        function getSignedS3Request (file) {
            var url = '/upload/sign_request?filename=' + file.name + '&filetype=' + file.type;
            return $http.get(url);
        }

        /**
         * This method creates a new problem
         * @param problem
         * @returns {*}
         */
        function submitProblem (problem) {
            var url = '/me/problem';
            var header = {authorization: $localStorage.user.token};
            return $http({
                method: 'post',
                url: url,
                headers: header,
                data: problem
            });
        }

        function myProblemList(token){
            var header = {authorization: token};
            var url = '/me/myproblems';
            return $http.get(url, {headers: header}).then(getMyProblemLsPromise);
        }

        function getMyProblemLsPromise(response){
            if (response.data.type === 200) {
                angular.copy(response.data.data, problemObject.myProblemFeeds);
            } else {
                delete $localStorage.user;
                $state.go('login');
            }
            return response;
        }

        /**
         * Returns one problem details
         *
         * @param problem_id
         * @returns {*|{get}}
         */
        function getProblem(problem_id) {
            var header = {authorization: $localStorage.user.token};
            var url = '/me/problem/' + problem_id;
            return $http.get(url, {headers: header}).then(getProblemPromise);
        }

        /**
         * Promise handler for one problem
         *
         * @param response
         * @returns {*}
         */
        function getProblemPromise(response) {
            return response;
        }

        /**
         * This method creates a new team
         * @param team
         * @returns {*}
         */
        function submitTeam(team, problemId) {
            var url = '/me/problem/'+ problemId +'/teams';
            var header = {authorization: $localStorage.user.token};
            return $http({
                method: 'post',
                url: url,
                headers: header,
                data: team
            });
        }

        /**
         * Returns a list of teams for a problem id
         * @param problemId
         * @returns {*}
         */
        function getTeams(problemId) {
            var url = "/me/problem/"+ problemId + "/teams";
            var header = {authorization: $localStorage.user.token};
            return $http.get(url, {headers: header}).then(getTeamsPromise);
        }

        /**
         * Promise handler for list of teams
         */
        function getTeamsPromise(response) {
            console.log(response);
            return response;
        }

        return problemObject;
    }
})();