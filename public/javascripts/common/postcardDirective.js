/**
 * Created by Neeraj on 11/16/2015.
 */
angular
    .module('myApp')
    .directive('postcard', Postcard);

    function Postcard() {
        return ({
            restrict: 'E',
            replace: true,
            templateUrl: '/components/card.html',
            scope: {
                data: '=item'
            },
            link: function(scope, element, attrs) {
                scope.feedItem = {
                    title: scope.data.title,
                    postDate: scope.data.date,
                    desc: scope.data.description,
                    limit: 300
                };
                console.log('data: ' + scope.data.title);
            }
        })
    }
