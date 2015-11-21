/**
 * Created by ashishnarkhede on 11/19/15.
 */
(function () {
    'use strict';

    angular.module('myApp')
        //upload service for file uploads
        .factory('problemService', problemService);

    problemService.$inject = ['$http'];

    function problemService($http){

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
            var header = {'authorization': "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InN2YWxlY2hhOTEiLCJwYXNzd29yZCI6InBhc3N3b3JkIiwiZmlyc3RfbmFtZSI6IlN1bWl0IiwibGFzdF9uYW1lIjoiVmFsZWNoYSIsIl9pZCI6IjU2NDkxOWZjYmM5Mjc4ZmQwZTRiNjRhOSIsImV4cGVydGlzZSI6W10sImludGVyZXN0cyI6WyJNb25nb0RCIiwiQW5kcm9pZCIsIk5vZGVqcyIsIkphdmFzY3JpcHQiLCJKYXZhIl0sInRlYW1zX3dvcmtpbmciOltdLCJ0ZWFtc19vd25lZCI6W10sInByb2JsZW1zX3dvcmtpbmciOltdLCJwcm9ibGVtc19vd25lZCI6W119.tWWVN5dHXBlYTLYlzlJrHRgSJFhllfmBPq9Ej9j0Qr8"};
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