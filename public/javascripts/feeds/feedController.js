/*** Created by Neeraj on 11/15/2015. ***/
(function() {
    'use strict'
    angular
        .module('myApp')
        .controller('feedController', FeedController);

    FeedController.$inject = ['$scope', '$stateParams', 'feedsProv'];
    function FeedController($scope, $stateParams, feedsProv){
        var feedVm = this;
        feedVm.mainSidebarState = false;
        feedVm.controlSidebarState = false;
        feedVm.userData = $stateParams.myParam;
        feedVm.feeds = feedsProv.data;
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
    }
})();