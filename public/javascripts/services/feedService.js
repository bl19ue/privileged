angular.module('myApp')
    .factory('feeds', ['$state', '$http', function($state, $http) {
        var feedsObject = {
            feeds: []
        };

        /**
         * Returns feeds based on the search query passed, if nothing is passed
         * the result will be based on the interests of the user
         *
         * @param token
         * @param request
         * @param page_num
         * @returns {*|{get}}
         */
        feedsObject.getFeeds = function(token, request, page_num){
            var headers = { 'authorization': token };
            var query = '';
            for(var i=0;i<request.length;i++) {
                query += 'search=' + request[i];
                if(i != request.length - 1) {
                    query += '&';
                }
            }

            var url = '/me/feeds/' + page_num + '/?' + query;
            return $http.get(url, {headers: headers}).then(function(response) {
                if(response.status === 200) {
                    feedsObject.error = false;

                    angular.copy(response.data, feedsObject.feeds);
                } else {
                    feedsObject.error = true;
                    feedsObject.errorMessage = response.errorMessage;
                }
            });
        };

        return feedsObject;
    }]
);