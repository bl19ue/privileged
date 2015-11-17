angular.module('myApp')
.factory('user', ['$state', '$http', function($state, $http) {
        var userObject = {
            user: {},
            token: ''
        };

        /**
         * Sign in service
         *
         * @param email
         * @param password
         * @returns {*|{get}}
         */
        userObject.signin = function(email, password){
            var obj = {
                email: email,
                password: password
            };
            return $http.post('/authenticate', obj).then(function(response) {
                if(response.status === 200) {
                    userObject.error = false;

                    angular.copy(response.data, userObject.user);
                    userObject.token = response.data.token;
                } else {
                    userObject.error = true;
                    userObject.errorMessage = response.errorMessage;
                }
            });
        };

        /**
         * New user registering service
         *
         * @param user
         * @returns {*|{get}}
         */
        userObject.register = function(user) {
            return $http.post('/register', user).then(function(response) {
                if(response.status === 200) {
                    userObject.error = false;

                    angular.copy(response.data, userObject.user);
                    userObject.token = response.data.token;
                } else {
                    userObject.error = true;
                    userObject.errorMessage = response.errorMessage;
                }
            });
        };

        return userObject;
    }]
);