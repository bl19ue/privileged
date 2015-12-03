/**
 * Created by sumitvalecha on 11/28/15.
 */

(function () {
    'use strict';
    angular
        .module('myApp')
        .controller('statsController', StatsController);

    StatsController.$inject = ['$scope', '$localStorage', '$state', 'statsProvider', 'myFeedsProv'];
    function StatsController($scope, $localStorage, $state, statsProvider, myFeedsProv){
        var statsVm = this;

        statsVm.getContributorChart = getContributorChart;
        statsVm.getLineOfCodeChart = getLineOfCodeChart;
        statsVm.myProblemList = myFeedsProv.data.data;
        statsVm.getProblem = getProblem;
        statsVm.expertiseChart = getExpertiseChart();

        statsVm.mainSidebarState = false;
        statsVm.controlSidebarState = false;
        //hide the sidebar initially
        angular.element('.control-sidebar').css('visibility', 'hidden');

        $scope.$on('toggle-main-sidebar', function(event, data){
            console.log(data);
            statsVm.mainSidebarState = !statsVm.mainSidebarState;
            if(statsVm.mainSidebarState){
                angular.element('.main-sidebar').css('transform', 'translate(0,0)');
            } else {
                angular.element('.main-sidebar').css('transform', 'translate(-230px,0)');
            }
        });

        $scope.$on('toggle-control-sidebar', function(event, data) {
            statsVm.controlSidebarState = !statsVm.controlSidebarState;
            if(statsVm.controlSidebarState){
                angular.element('.control-sidebar').css('visibility', 'visible');
            } else {
                angular.element('.control-sidebar').css('visibility', 'hidden');
            }
        });


        function getProblem(id){
            $state.go('problem-detail', {data: id});
        }

        var stats = statsProvider.data.data;

        var totalLinesOfCode = 0,
            totalCommits = 0,
            totalContributors = 0,
            reponame = [],
            commits = [],
            contributors = [],
            lineOfCodes = [],
            languages = [];

        for(var i=0;i<stats.length;i++) {
            reponame.push(stats[i].reponame);

            totalLinesOfCode += parseInt(stats[i].lines_of_code);
            totalCommits += parseInt(stats[i].commits);
            totalContributors += stats[i].contributors.length;

            lineOfCodes.push(parseInt(stats[i].lines_of_code));
            commits.push(parseInt(stats[i].commits));
            contributors.push(stats[i].contributors.length);

            var languagesInRepo = stats[i].languages;
            var keys = Object.keys(stats[i].languages);

            for(var j=0;j<keys.length;j++) {
                if(!languages[keys[j]]) {
                    languages[keys[j]] = languagesInRepo[keys[j]];
                } else {
                    languages[keys[j]] += languagesInRepo[keys[j]];
                }
            }
        }

        function getCommitsChart() {
            var data = {
                name: 'Commits',
                colorByPoint: true,
                data: []
            };
            var series = [];
            var dataExternal = [];
            var dataInternal = [];

            for(var i=0;i<reponame.length;i++) {
                var obj = {};
                obj.name = reponame[i];
                obj.y = commits[i];
                obj.drilldown = reponame[i];

                data.data.push(obj);

                dataExternal = [];
                for(var j=0;j<contributors[i];j++) {
                    dataInternal = [];
                    dataInternal.push(stats[i].contributors[j].name);
                    dataInternal.push(stats[i].contributors[j].commits);
                    dataExternal.push(dataInternal);
                }

                series.push({
                    name: reponame[i],
                    id: reponame[i],
                    data: dataExternal
                });
            }

            var chart = getHighchartsNG('Commits', data, series);
            return chart;
        }

        function getContributorChart() {
            var data = {
                name: 'Contributors',
                colorByPoint: true,
                data: []
            };
            var series = [];
            var dataExternal = [];
            var dataInternal = [];

            for(var i=0;i<reponame.length;i++) {
                var obj = {};
                obj.name = reponame[i];
                obj.y = contributors[i];
                obj.drilldown = reponame[i];

                data.data.push(obj);

                dataExternal = [];
                for(var j=0;j<contributors[i];j++) {
                    dataInternal = [];
                    dataInternal.push(stats[i].contributors[j].name);
                    dataInternal.push(stats[i].contributors[j].commits);
                    dataExternal.push(dataInternal);
                }

                series.push({
                    name: reponame[i],
                    id: reponame[i],
                    data: dataExternal
                });
            }

            var chart = getHighchartsNG('Contributors', data, series);
            return chart;
        }

        function getLineOfCodeChart() {
            var data = {
                name: 'Line of codes',
                colorByPoint: true,
                data: []
            };
            var series = [];
            var dataExternal = [];
            var dataInternal = [];

            for(var i=0;i<reponame.length;i++) {
                var obj = {};
                obj.name = reponame[i];
                obj.y = lineOfCodes[i];
                obj.drilldown = reponame[i];

                data.data.push(obj);

                dataExternal = [];
                for(var j=0;j<contributors[i];j++) {
                    dataInternal = [];
                    dataInternal.push(stats[i].contributors[j].name);
                    dataInternal.push(stats[i].contributors[j].commits);
                    dataExternal.push(dataInternal);
                }

                series.push({
                    name: reponame[i],
                    id: reponame[i],
                    data: dataExternal
                });
            }

            var chart = getHighchartsNG('Line of codes', data, series);
            return chart;
        }

        function getHighchartsNG(title, data, series) {
            var highchartsNG = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        type: 'category'
                    },
                    yAxis: {
                        title: {
                            text: title
                        }
                    },
                    drilldown: {
                        series: series
                    }
                },
                title: {
                    text: title
                },
                series: [data]

            }

            return highchartsNG;
        }

        function getExpertiseChart() {
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

        statsVm.getCommitsChart = getCommitsChart();
        statsVm.getContributorChart = getContributorChart();
        statsVm.getLineOfCodeChart = getLineOfCodeChart();

    }
})();
