/**
 * Created by Neeraj on 11/16/2015.
 */
angular
    .module('myApp')
    .directive('postcard', Postcard);
    Postcard.$inject = ['$state', '$localStorage'];
    function Postcard(state, $localStorage) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/components/card.html',
            scope: {
                data: '=item'
            },
            link: function(scope, element, attrs) {
                scope.count = scope.data.upvotes;
                scope.incr = function(){
                    if(!$localStorage.user.likes) {
                        $localStorage.user.likes = [];
                    }

                    if($localStorage.user.likes.indexOf(scope.data._id) != -1) {
                        return;
                    }

                    scope.count = scope.count + 1;
                    $localStorage.user.likes.push(scope.data._id);
                }
                scope.feedItem = {
                    title: scope.data.title,
                    postDate: scope.data.date,
                    desc: scope.data.description,
                    count: scope.data.upvotes,
                    limit: 300,
                    getProblem: function(){
                        state.go('problem-detail', {'data': scope.data});
                    }
                };
            }
        }
    }
