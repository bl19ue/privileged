angular
    .module('myApp')
    .factory('userService', UserService);

    UserService.$inject = ['$state', '$http'];

    function UserService ($state, $http) {
        var userObject = {
            user: {},
            token: ''
        };

        userObject.setUserObject = setUserObject;
        userObject.signin = signin;
        userObject.register = register;

        function setUserObject(user, token) {
            userObject.user = user;
            userObject.token = token;
        };

        /**
         * Sign in service
         *
         * @param email
         * @param password
         * @returns {*|{get}}
         */
        function signin(email, password){
            var obj = {
                email: email,
                password: password
            };
            return $http.post('/authenticate', obj).then(loginResponse);
        };

        function loginResponse(response) {
            if(response.status === 200) {
                angular.copy(response.data, userService.user);
                userService.token = response.data.token;
            } else {
                //logging
            }
            return response;
        };

        /**
         * New user registering service
         *
         * @param user
         * @returns {*|{get}}
         */
        function register(user) {
            return $http.post('/register', user).then( resgisterResponse);
        };

        function resgisterResponse (response) {
            if(response.status === 200) {
                userObject.error = false;
                angular.copy(response.data, userObject.user);
                userObject.token = response.data.token;
            } else {
                userObject.error = true;
                userObject.errorMessage = response.errorMessage;
            }
            return response;
        }

        return userObject;
    }
