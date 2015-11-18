angular
    .module('myApp')
    .factory('userService', UserService);

UserService.$inject = ['$http'];

function UserService ($http) {
    var userObject = {
        user: {},
        token: ''
    };

    userObject.signin = signin;
    userObject.register = register;

    /**
     * Sign in service
     *
     * @param email
     * @param password
     * @returns {*|{get}}
     */
    function signin(email, password) {
        var obj = {
            email: email,
            password: password
        };
        return $http.post('/authenticate', obj).then(signinResponse);
    }

    /**
     * New user registering service
     *
     * @param user
     * @returns {*|{get}}
     */
    function register(user) {
        return $http.post('/register', user).then(resgisterResponse);
    }

    /**
     * Response returned after signin service
     *
     * @param response
     * @returns {*}
     */
    function signinResponse(response) {
        if(response.status === 200) {
            angular.copy(response.data.data, userObject.user);
            userObject.token = response.data.token;
        } else {
            console.log('error404');
        }
        return response;
    }

    /**
     * Response returned after register service
     *
     * @param response
     * @returns {*}
     */
    function resgisterResponse (response) {
        if(response.status === 200) {
            angular.copy(response.data.data, userObject.user);
            userObject.token = response.data.token;
        } else {
            console.log('error404');
        }
        return response;
    }

    return userObject;
}
