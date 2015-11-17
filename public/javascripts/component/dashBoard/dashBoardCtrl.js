/**
 * Created by Neeraj on 11/15/2015.
 */
angular
    .module('myApp')
    .controller('dashBoardCtrl', DashBoardCtrl);

    DashBoardCtrl.$inject = ['$stateParams'];

    function DashBoardCtrl($stateParams){
        var vm = this;

        vm.userData = $stateParams.myParam;
        vm.feeds = $scope.userData.feeds;

        vm.readonly = false;
        vm.interests = [];

        vm.roInterests = angular.copy(vm.interests);
        vm.tags = [];

        vm.newInterest = function(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        };
    }
