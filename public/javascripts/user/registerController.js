/**
 * Created by Neeraj on 11/17/2015.
 */

angular
    .module('myApp')
    .controller('registerController', RegisterController);

RegisterController.$inject = ['$state', 'userService'];

function RegisterController ($state, userService) {
    var registerVm = this;
    registerVm.readonly = false;

    registerVm.interests = [];
    registerVm.roInterests = angular.copy(registerVm.interests);
    registerVm.interestTags = [];
    registerVm.newInterest = createInterestChip;

    registerVm.registerUser = registerUser;
    registerVm.isError = false;

    function createInterestChip (chip) {
        return {
            name: chip,
            type: 'unknown'
        };
    };

    function registerUser (){
        var name = registerVm.user.name.split(' ');
        registerVm.user.first_name = name[0];
        registerVm.user.last_name = name[1];
        registerVm.user.interests = registerVm.roInterests;

        userService.register(registerVm.user).then(registerPromise);

        function registerPromise(response) {
            if(!response.data.isError) {
                registerVm.isError = false;
                $state.go('home');
            } else {
                registerVm.isError = true;
            }
        }
    }
}