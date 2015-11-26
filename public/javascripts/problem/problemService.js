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
         * This method creates a new problem
         * @param problem
         * @returns {*}
         */

        function submitProblem(problem) {
            var url = '/me/problem';
            var header = $localStorage.user.token;
            return $http({
                method: 'post',
                url: url,
                headers: header,
                data: problem
            });
        }
        return problemObject;
    }
})();