/*** Created by Neeraj on 11/16/2015. ***/
(function () {
    'use strict'
    angular
        .module('myApp')
        .directive('postcard', Postcard);

    Postcard.$inject = ['$state', '$localStorage', 'feedService'];
    function Postcard(state, $localStorage, feedService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/components/card.html',
            scope: {
                data: '=item'
            },
            link: function (scope, element, attrs) {
                scope.count = scope.data.upvotes;
                scope.incr = function () {
                    if (!$localStorage.user.likes) {
                        $localStorage.user.likes = [];
                    }
                    if ($localStorage.user.likes.indexOf(scope.data._id) != -1) {
                        return;
                    }
                    feedService.incrementUpvoteCount(scope.data._id);
                    scope.count = scope.count + 1;
                    $localStorage.user.likes.push(scope.data._id);
                }
                scope.feedItem = {
                    title: scope.data.title,
                    postDate: scope.data.date,
                    desc: scope.data.description,
                    count: scope.data.upvotes,
                    people: scope.data.people.length,
                    teams: scope.data.teams.length,
                    limit: 300,
                    getProblem: function () {
                        state.go('problem-detail', {'data': scope.data});
                    }
                };
            }
        }
    }
})();
