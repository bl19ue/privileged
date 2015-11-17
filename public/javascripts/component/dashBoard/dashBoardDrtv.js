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
                scope.intItem = {
                    title: scope.data.title,
                    desc: scope.data.Desc,
                    limit: 40
                };
                console.log('data: ' + scope.data.title);
            }
        })
    }
