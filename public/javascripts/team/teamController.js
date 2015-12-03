/**
 * Created by ashishnarkhede on 11/24/15.
 *//**
 * Created by ashishnarkhede on 11/17/15.
 */
(function () {
    'use strict';

    angular.module('myApp')
        .controller('teamController', TeamController);

    TeamController.$inject = ['$scope', '$localStorage', 'teamService', 'teamDetailsProvider', 'myFeedsProv']

    function TeamController($scope, $localStorage, teamService, teamDetailsProvider, myFeedsProv) {
        var teamVm = this;
        teamVm.myProblemList = myFeedsProv.data.data;
        teamVm.mainSidebarState = false;
        teamVm.controlSidebarState = false;
        teamVm.init = init;
        teamVm.team = teamDetailsProvider;
        teamVm.team.problem = $localStorage.problem;
        teamVm.technologies = teamDetailsProvider.technologies;
        teamVm.commentText = undefined;

        teamVm.joinTeam = joinTeam;
        teamVm.comment = comment;
        teamVm.getComments = getComments;


        init();
        //hide the sidebar initially
        angular.element('.control-sidebar').css('visibility', 'hidden');

        $scope.$on('toggle-main-sidebar', function(event, data){
            console.log(data);
            teamVm.mainSidebarState = !teamVm.mainSidebarState;
            if(teamVm.mainSidebarState){
                angular.element('.main-sidebar').css('transform', 'translate(0,0)');
            } else {
                angular.element('.main-sidebar').css('transform', 'translate(-230px,0)');
            }
        });

        $scope.$on('toggle-control-sidebar', function(event, data) {
            teamVm.controlSidebarState = !teamVm.controlSidebarState;
            if(teamVm.controlSidebarState){
                angular.element('.control-sidebar').css('visibility', 'visible');
            } else {
                angular.element('.control-sidebar').css('visibility', 'hidden');
            }
        });


       function init(){
            var loggedInUser = $localStorage.user.first_name + " " + $localStorage.user.last_name;
            if(teamVm.team.members.indexOf(loggedInUser) !== -1) {
                angular.element('.btnJoinTeam').css('display', 'none');
            }
            else { angular.element('.btnJoinTeam').css('display', 'block'); }
        }

        /**
         * Join a team
         */
        function joinTeam() {
           teamService.joinTeam(teamVm.team).then(function(response){
               if(response.status === 200) {
                   console.log(response);
               }
           });
       }

        /**
         * Submit a comment
         */
       function comment() {
            teamService.postComment(teamVm.team._id, teamVm.commentText).then(function(response){
               if(response.status === 200) {
                   console.log(response);
               }
            });
       }

        /**
         * Get a list of comments
         */
        function getComments() {

       }
    }
})();
