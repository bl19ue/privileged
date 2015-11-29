/**
 * Created by sumitvalecha on 11/28/15.
 */

angular.module('myApp')
    .factory('statsService', StatsService);

StatsService.$inject = ['$http', '$state'];

function StatsService($http, $state) {
    var statsObject = {};

    statsObject.getStatistics = getStatistics;

    function getStatistics() {
        return $http.get('/statistics').then(handleStatisticsResponse);
    }

    function handleStatisticsResponse(response) {
        if(!response.isError) {
            return response;
        } else {
            $state.go('home');
        }
    }

    return statsObject;
}