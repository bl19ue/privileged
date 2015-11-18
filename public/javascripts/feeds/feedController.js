/**
 * Created by Neeraj on 11/15/2015.
 */
angular
    .module('myApp')
    .controller('feedController', FeedController);

FeedController.$inject = ['$stateParams', 'feedsProv'];

function FeedController($stateParams, feedsProv){
    var feedVm = this;

    feedVm.userData = $stateParams.myParam;
    feedVm.feeds = feedsProv.data;

    feedVm.readonly = false;
    //vm.interests = [];

    //vm.roInterests = angular.copy(vm.interests);
    feedVm.tags = [];

    feedVm.newInterest = function(chip) {
        return {
            name: chip,
            type: 'unknown'
        };
    };
}
