/**
 * Created by Neeraj on 11/17/2015.
 */

angular
    .module('myApp')
    .controller('loginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['$state', 'userService', 'feedService', '$mdDialog'];

    function LoginCtrl($state, userService, feedService, $mdDialog) {
        var userVm = this;
        userVm.user = {};
        userVm.status = '  ';
        userVm.login = login;
        userVm.showModal = showModal;

        function login () {
            userService.signin(userVm.user.email, userVm.user.password).then();
        };

        function signinPromise(response) {
            //Check for reponse and call feeds service.
        }

        function showModal(ev) {
            $mdDialog.show({
                controller: 'dialogCtrl',
                templateUrl: '/dialogBox/forgotPassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(answer) {
                    userVm.status = 'You said the information was "' + answer + '".';
            }, function() {
                    userVm.status = 'You cancelled the dialog.';
            });
        }
    }