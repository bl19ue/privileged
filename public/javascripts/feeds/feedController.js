/**
 * Created by Neeraj on 11/15/2015.
 */
angular
    .module('myApp')
    .controller('feedController', FeedController);

FeedController.$inject = ['$scope', '$stateParams', 'feedsProv'];

function FeedController($scope, $stateParams, feedsProv){
    var feedVm = this;

    feedVm.userData = $stateParams.myParam;
    feedVm.feeds = feedsProv.data;

    feedVm.readonly = false;

    $scope.$on('searchFeed', function(event, response) {
        feedVm.feeds = response.data;
    });
}
