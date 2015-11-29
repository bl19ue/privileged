/**
 * Created by sumitvalecha on 11/28/15.
 */

(function () {
    'use strict';
    angular
        .module('myApp')
        .controller('statsController', StatsController);

    StatsController.$inject = ['$scope', '$state', 'statsProvider'];
    function StatsController($scope, $state, statsProvider){
        var statsVm = this;

        statsVm.getContributorChart = getContributorChart;
        statsVm.getLineOfCodeChart = getLineOfCodeChart;

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

        statsVm.getCommitsChart = getCommitsChart();
        statsVm.getContributorChart = getContributorChart();
        statsVm.getLineOfCodeChart = getLineOfCodeChart();

    }
})();
