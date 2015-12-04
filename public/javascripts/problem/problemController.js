/*** Created by ashishnarkhede on 11/17/15. ***/
(function () {
    'use strict';
    angular
        .module('myApp')
        .controller('problemController', ProblemController);

    ProblemController.$inject = ['$scope', '$state','problemService', 'problemDetailProvider', 'teamsProvider', '$stateParams', '$localStorage'];
    function ProblemController(scope, state, problemService, problemDetailProvider, teamsProvider, stateParams, $localStorage){

        var problemVm = this;
        problemVm.attachment = undefined;
        problemVm.title = undefined;
        problemVm.myFile = undefined;
        problemVm.problem = {};
        problemVm.progressVisible = false;
        problemVm.progress = undefined;
        problemVm.submitdisabled  = false;
        problemVm.readonly = false;
        //angular chips for technology tags
        problemVm.technologies = [];
        problemVm.roTechnologies = angular.copy(problemVm.technologies);
        problemVm.techtags = [];
        //angular chips for tools tags
        problemVm.tools = [];
        problemVm.roTools = angular.copy(problemVm.tools);
        problemVm.tooltags = undefined;
        problemVm.mediaBucketUrl = "https://cmpe295b-sjsu-bigdatasecurity.s3.amazonaws.com";
        problemVm.problem_media = [];
        problemVm.mainSidebarState = false;
        problemVm.controlSidebarState = false;
        problemVm.showModal = false;
        problemVm.team = {};
        // this list holds the team details
        problemVm.teams = [];

        problemVm.getProblem = getProblem;
        problemVm.newTechnology = createTechnologyChip;
        problemVm.newTool = createNewToolChip;
        problemVm.uploadMedia = uploadMedia;
        problemVm.submitProblem = submitProblem;
        problemVm.problem_detail = stateParams.data;
        problemVm.myProblemList = problemService.myProblemFeeds;
        problemVm.submitTeam = submitTeam;
        problemVm.getTeamDetails = getTeamDetails;

        angular.element('.control-sidebar').css('visibility', 'hidden');
        problemVm.toggleModal = function(){
            problemVm.team = {};
            problemVm.showModal = !problemVm.showModal;
        };

        problemVm.highchartsNG = getHighchartsNg();

        // bind data from the resolve
        if(problemDetailProvider !== undefined){
            problemVm.problemDetail = problemDetailProvider.data.data;
            problemVm.technologies = problemVm.problemDetail.technologies;
            problemVm.tools = problemVm.problemDetail.tools;
        }

        if(teamsProvider !== undefined) {
            problemVm.teams = teamsProvider.data.data;
        }

        /**
         * Handle events to toggle sidebars
         */
        scope.$on('toggle-main-sidebar', function(event, data){
            console.log(data);
            problemVm.mainSidebarState = !problemVm.mainSidebarState;
            if(problemVm.mainSidebarState){
                angular.element('.main-sidebar').css('transform', 'translate(0,0)');
            } else {
                angular.element('.main-sidebar').css('transform', 'translate(-230px,0)');
            }
        });

        scope.$on('toggle-control-sidebar', function(event, data) {
            problemVm.controlSidebarState = !problemVm.controlSidebarState;
            if(problemVm.controlSidebarState){
                angular.element('.control-sidebar').css('visibility', 'visible');
            } else {
                angular.element('.control-sidebar').css('visibility', 'hidden');
            }
        });

        function createTechnologyChip(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        }


        function getTeamDetails(teams, teamId) {
            var teamSelected;
            for(var team in teams) {
                console.log(team);
                console.log(teams[team]);
                if(teams[team]._id === teamId) {
                    teamSelected = teams[team];
                }
            }
            $localStorage.problem = problemVm.problemDetail;
            state.go('team', {data: teamSelected});
        }

        function submitTeam() {
            var newTeam = problemVm.team;
            newTeam.tools = problemVm.roTools;
            newTeam.technologies = problemVm.roTechnologies;

            problemService.submitTeam(newTeam, stateParams.data._id).then(function(response){
                if(response.status === 200) {
                    console.log('Team created: ' + newTeam);
                    console.log(response.data.data);
                    // close the modal once team is created
                    angular.element('.modal').modal('hide');
                    // update the list of teams with the newly added team
                    problemVm.teams.push(response.data.data);

                } else {
                    console.log('Failed');
                }
            });
        }

        function getProblem(id){
            problemService.getProblem(id).then(function (response){
                if(response !== undefined){
                    problemVm.problemDetail = response.data.data;
                    problemVm.technologies = problemVm.problemDetail.technologies;
                    problemVm.tools = problemVm.problemDetail.tools;

                    problemService.getTeams(id).then(function(response) {
                       problemVm.teams = [];
                        problemVm.teams = response.data.data;

                    });
                    //scope.$digest();
                }
            });
        }

        scope.$on('getProblemList', function(event, response) {
            problemVm.myProblemList = response.data;
            scope.$digest();
        });

        function createNewToolChip(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        }

        /*** This method creates a new problem using data provided by the user ***/
        function submitProblem() {
            var newProblem = problemVm.problem;
            newProblem.tools = problemVm.roTools;
            newProblem.technologies = problemVm.roTechnologies;

            problemService.submitProblem(newProblem).then(function(response){
                if(response.status === 200) {
                    console.log('Problem created: ' + newProblem);
                    state.go('problem-detail', {data: response.data.data});
                } else {
                    console.log('Failed');
                }
            });
        }

        /*** This method uploads the media into AWS S3 bucket ***/
        function uploadMedia() {
            var signedURL;
            var file;
            file = problemVm.myFile;
            //get a signed S3 request for the file selected by user
            problemService.getSignedS3Request(file).then(function(response){
                if(response.status === 200){
                    signedURL = response.data.signed_request;
                    console.log(response.data);
                    var xhr = new XMLHttpRequest();
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.addEventListener("error", uploadFailed, false);
                    xhr.addEventListener("abort", uploadCanceled, false);
                    xhr.open("PUT", signedURL);
                    // make the file publically downloadable
                    xhr.setRequestHeader('x-amz-acl', 'public-read');
                    problemVm.submitdisabled = true;
                    problemVm.progress = 0;

                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            console.log("File upload complete");
                            // clean up code
                            problemVm.submitdisabled = false;
                            problemVm.problem.problem_media.push(problemVm.mediabucketurl + file.name);
                        }
                    };
                    xhr.onerror = function() {
                        alert("Could not upload file.");
                        problemVm.submitdisabled = false;
                    };

                    problemVm.progressVisible = true;
                    console.log(signedURL);
                    xhr.send(file);
                }
                else {
                    console.log(response);
                }
            });
        }

        /**
         * This method updates the file upload progress whenever the progress length is computable
         * @param evt
         */
        function uploadProgress(evt) {
            scope.$apply(function() {
                if (evt.lengthComputable) {
                    problemVm.progress = Math.round(evt.loaded * 100 / evt.total);
                    if (problemVm.progress === 100) {
                        problemVm.progress = Math.round(evt.loaded * 100 / evt.total);
                        if (problemVm.progress == 100) {
                            problemVm.submitdisabled = false;
                        }
                    } else {
                        problemVm.progress = 'unable to compute'
                    }
                }
            });
        }

        /**
         * Upload complete handler notifies once file upload is completed successfully
         * @param evt
         */
        function uploadComplete(evt) {
            console.log(evt.target.responseText);
            problemVm.submitdisabled = false;
        }

        /**
         * Upload failed handler notifies if file upload fails
         * @param evt
         */
        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file.");
            problemVm.submitdisabled = false;
        }

        /**
         * Upload canceled handler notifies in case the upload is canceled
         * @param evt
         */
        function uploadCanceled(evt) {
            scope.$apply(function(){
                problemVm.progressVisible = false;
                problemVm.submitdisabled = false;
            })
            alert("The upload has been canceled by the user or the browser dropped the connection.");
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