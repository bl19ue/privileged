/**
 * Created by Neeraj on 11/27/2015.
 */
(function () {
    'use strict'
    angular
        .module('myApp')
        .directive('myProblem', MyProblem);

    MyProblem.$inject = ['$state'];
    function Postcard(state) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/components/myProblem.html',
            scope: {
                data: '=item'
            },
            link: function (scope, element, attrs) {
                scope.feedItem = {
                    title: scope.data.title,
                    limit: 300,
                    getProblem: function () {
                        state.go('problem-detail', {'data': scope.data});
                    }
                };
            },
            controller: 'myProblem',
            controllerAs: 'probVm'
        }
    }
})();

