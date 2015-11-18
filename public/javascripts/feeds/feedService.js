angular.module('myApp')
    .factory('feedService', FeedService);

FeedService.$inject = ['$http'];

function FeedService($http) {
    var feedsObject = {
        feeds: []
    };

    feedsObject.getFeeds = getFeeds;

    /**
     * Returns feeds based on the search query passed, if nothing is passed
     * the result will be based on the interests of the user
     *
     * @param token
     * @param request
     * @param page_num
     * @returns {*|{get}}
     */
    function getFeeds(token, request, page_num) {
        var headers = {'authorization': token};
        var query = '';
        for (var i = 0; i < request.length; i++) {
            query += 'search=' + request[i];
            if (i != request.length - 1) {
                query += '&';
            }
        }

        var url = '/me/feeds/' + page_num + '/?' + query;
        return $http.get(url, {headers: headers}).then(getFeedsResponse);
    }

    /**
     * Returns response from getFeeds service
     *
     * @param response
     * @returns {*}
     */
    function getFeedsResponse(response) {
        if (response.status === 200) {
            angular.copy(response.data, feedsObject.feeds);
        } else {
            //logging
        }

        return response;
    }

    return feedsObject;

}