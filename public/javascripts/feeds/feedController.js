/*** Created by Neeraj on 11/15/2015. ***/
(function() {
    'use strict'
    angular
        .module('myApp')
        .controller('feedController', FeedController);

    FeedController.$inject = ['$scope', '$state', '$stateParams', 'feedsProv', 'myFeedsProv', 'feedService', '$localStorage'];
    function FeedController($scope, $state, $stateParams, feedsProv, myFeedsProv, feedService, $localStorage){
        var feedVm = this;

        feedVm.userData = $stateParams.myParam;
        feedVm.feeds = feedsProv.data.data;
        feedVm.myProblemList = myFeedsProv.data.data;
        feedVm.pages = Math.ceil($localStorage.total_results / 10);
        feedVm.range = range;

        feedVm.updateFeeds = updateFeeds;
        feedVm.getProblem = getProblem;

        feedVm.mainSidebarState = false;
        feedVm.controlSidebarState = false;
        //hide the sidebar initially
        angular.element('.control-sidebar').css('visibility', 'hidden');

        feedVm.highchartsNG = getHighchartsNg();

        function getProblem(id){
            $state.go('problem-detail', {data: id});
        }

        $scope.$on('searchFeed', function(event, response) {
            feedVm.feeds = response.data.data;
            feedVm.pages = Math.ceil($localStorage.total_results / 10);
            feedVm.range = range;
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
                angular.element('.control-sidebar').css('visibility', 'visible');
            } else {
                angular.element('.control-sidebar').css('visibility', 'hidden');
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
            for(var i = 0; i < num; i++) {
                range.push(i+1);
            }
            return range;
        }

        function getHighchartsNg() {
            var expertise = $localStorage.user.expertise;
            var techs = [];
            var score = [];
            for(var i=0;i<expertise.length;i++) {
                techs.push(expertise[i].technology);
                score.push(expertise[i].score);
            }

            var highchartsNG = {
                options: {
                    chart: {
                        type: 'bar'
                    }
                },
                xAxis: {
                    categories: techs,
                    title: {
                        text: null
                    }
                },
                series: [{
                    data: score
                }],
                title: {
                    text: 'Expertise'
                },
                loading: false
            }

            return highchartsNG;
        }
    }
})();
