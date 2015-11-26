/*** Created by ashishnarkhede on 11/17/15. ***/
(function () {
    'use strict';

    angular.module('myApp')
        .controller('problemController', ProblemController);

    ProblemController.$inject = ['$scope','problemService']

    function ProblemController(scope, problemService){

        var self = this;
        self.attachment = undefined;
        self.title = undefined;
        self.myFile = undefined;
        self.problem = {};
        self.mediabucketurl = "https://cmpe295b-sjsu-bigdatasecurity.s3.amazonaws.com/";
        self.problem.problem_media = [];
        self.progressVisible = false;
        self.progress = undefined;
        self.submitdisabled  = false;
        self.readonly = false;
    ProblemController.$inject = ['$scope','problemService', '$stateParams']

    function ProblemController(scope, problemService, stateParams){
        var problemVm = this;
        problemVm.attachment = undefined;
        problemVm.title = undefined;
        problemVm.myFile = undefined;
        problemVm.problem = {};
        problemVm.problem.mediaurls = [];
        problemVm.progressVisible = false;
        problemVm.progress = undefined;
        problemVm.submitdisabled  = false;
        problemVm.readonly = false;
        //angular chips for technology tags
        problemVm.technologies = [''];
        problemVm.roTechnologies = angular.copy(problemVm.technologies);
        problemVm.techtags = [];
        //angular chips for tools tags
        problemVm.tools = [''];
        problemVm.roTools = angular.copy(problemVm.tools);
        problemVm.tooltags = [];
        problemVm.newTechnology = createTechnologyChip;
        problemVm.newTool = createNewToolChip;
        problemVm.uploadMedia = uploadMedia;
        problemVm.submitProblem = submitProblem;
        problemVm.problem_detail = stateParams.data;

        function createTechnologyChip(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        }

        function createNewToolChip(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        }

        /**
         * This method creates a new problem using data provided by the user
         */
        function submitProblem() {
            var newProblem = self.problem;
            newProblem.tools = self.roTools;
            newProblem.technologies = self.roTechnologies;
            console.log(newProblem.problem_media);
            var newProblem = problemVm.problem;
            newProblem.tools = problemVm.roTools;
            newProblem.technologies = problemVm.roTechnologies;

            problemService.submitProblem(newProblem).then(function(response){
                if(response.status === 200) {
                    console.log('Problem created: ' + newProblem);
                }
                else {
                    console.log('Failed');
                }
            });
        }

        /**
         * This method uploads the media into AWS S3 bucket
         */

        function uploadMedia() {
            var signedURL;
            var file;
            file = problemVm.myFile;
            //get a signed S3 request for the file selected by user
            problemService.getSignedS3Request(file).then(function(response){
                //if signed request is received successfully
                if(response.status === 200){
                    signedURL = response.data.signed_request;
                    console.log(response.data);
                    // upload the file with the signed request
                    var xhr = new XMLHttpRequest();
                    // define event listeners to track update status and progress
                    xhr.upload.addEventListener("progress", uploadProgress, false);
                    xhr.addEventListener("load", uploadComplete, false);
                    xhr.addEventListener("error", uploadFailed, false);
                    xhr.addEventListener("abort", uploadCanceled, false);
                    // open a PUT request to upload the file
                    xhr.open("PUT", signedURL);
                    // make the file publically downloadable
                    xhr.setRequestHeader('x-amz-acl', 'public-read');
                    //disable the submit while file is being uploaded
                    problemVm.submitdisabled = true;
                    // set the progress bar value to zero in case user uploads multiple files back to back
                    problemVm.progress = 0;

                    xhr.onload = function() {
                        //if file upload request is completed successfully
                        if (xhr.status === 200) {
                            console.log("File upload complete");
                            // clean up code
                            self.submitdisabled = false;
                            self.problem.problem_media.push(self.mediabucketurl + file.name);
                            problemVm.submitdisabled = false;
                            problemVm.problem.mediaurls.push(file.name);
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
            scope.$apply(function(){
                if (evt.lengthComputable) {
                    self.progress = Math.round(evt.loaded * 100 / evt.total);
                    if(self.progress === 100) {
                    problemVm.progress = Math.round(evt.loaded * 100 / evt.total);
                    if(problemVm.progress == 100) {
                        // enable the submit button once upload is completed suucessfully
                        problemVm.submitdisabled = false;
                    }
                } else {
                    problemVm.progress = 'unable to compute'
                }
            })
        }

        /**
         * Upload complete handler notifies once file upload is completed successfully
         * @param evt
         */
        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
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
    }
})();