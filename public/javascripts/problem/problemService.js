/**
 * Created by ashishnarkhede on 11/19/15.
 */
(function () {
    'use strict';

    angular
        .module('myApp')
        //upload service for file uploads
        .factory('problemService', problemService);

    problemService.$inject = ['$http', '$localStorage'];

    function problemService($http, $localStorage){

        var problemObject = {
            problem: ''
        };

        problemObject.getSignedS3Request = getSignedS3Request;
        problemObject.submitProblem = submitProblem;
        problemObject.getProblem = getProblem;

        /**
         * This method gets the signed s3 request from the server
         *
         * @param file object
         * @returns {*|{get}}
         */
        function getSignedS3Request(file) {
            var url = '/upload/sign_request?filename=' + file.name + '&filetype=' + file.type;
            // just return the call, use then in controller
            return $http.get(url);
        }

        /**
         * This method creates a new problem
         * @param problem
         * @returns {*}
         */
        function submitProblem(problem) {
            var url = '/me/problem';
            var header = {authorization: $localStorage.user.token};
            return $http({
                method: 'post',
                url: url,
                headers: header,
                data: problem
            });
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

        return problemObject;
    }
})();