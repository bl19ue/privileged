/**
 * Created by Neeraj on 11/15/2015.
 */
angular
    .module('myApp')
    .controller('feedController', FeedController);

FeedController.$inject = ['$scope', '$stateParams', 'feedsProv', 'feedService', '$localStorage'];

function FeedController($scope, $stateParams, feedsProv, feedService, $localStorage){
    var feedVm = this;
    feedVm.mainSidebarState = false;
    feedVm.controlSidebarState = false;
    feedVm.userData = $stateParams.myParam;
    feedVm.feeds = feedsProv.data.data;
    feedVm.updateFeeds = updateFeeds;
    feedVm.pages = Math.ceil($localStorage.total_results / 10);
    feedVm.range = range;

    feedVm.readonly = false;

    $scope.$on('searchFeed', function(event, response) {
        feedVm.feeds = response.data;
        $scope.$digest();
    });

    $scope.$on('toggle-main-sidebar', function(event, data){
        console.log(data);
        feedVm.mainSidebarState = !feedVm.mainSidebarState;
        if(feedVm.mainSidebarState){
            angular.element('.main-sidebar').css('transform', 'translate(0,0)');
        } else {
            angular.element('.main-sidebar').css('transform', 'translate(-230px,0)');
        }
    });

    $scope.$on('toggle-control-sidebar', function(event, data) {
        feedVm.controlSidebarState = !feedVm.controlSidebarState;
        if(feedVm.controlSidebarState){
            angular.element('.control-sidebar').css('transform', 'translate(0,0)');
        } else {
            angular.element('.control-sidebar').css('transform', 'translate(-230px,0)');
        }
    });

    function updateFeeds(page_num) {
        var token = $localStorage.user.token;
        var request = $localStorage.search_request;

        feedService.getFeeds(token, request, page_num - 1).then(function(response) {
            if(!response.data.isError) {
                feedVm.feeds = response.data.data;
            }
        });
    }

    function range(num) {
        var range = [];
        for(var i=0;i<num;i++) {
            range.push(i+1);
        }

        return range;
    }
}
