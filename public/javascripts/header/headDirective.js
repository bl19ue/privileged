/**
 * Created by Neeraj on 11/21/2015.
 */
angular
    .module('myApp')
    .directive('bodyHeader', BodyHeader);

BodyHeader.$inject = ['$rootScope', '$state', 'userService', 'feedService', '$localStorage'];

function BodyHeader($rootScope, $state, userService, feedService, $localStorage) {
    function headController (){
        var headVm = this;

        headVm.search = search;
        headVm.newProblem = newProblem;
        headVm.logout = logout;

        function search(){
            headVm.searchArr = [];
            headVm.searchArr.push(headVm.inStr);
            feedService.getFeeds($localStorage.user.token, headVm.searchArr, 0).then(function (response){
                $rootScope.$broadcast('searchFeed', response);
            });
        }

        function newProblem(){
            alert('problem');
            $state.go('problem');
        }

        function logout(){
            if(userService.logout()) {
                $state.go('login');
            }
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/components/header.html',
        controller: headController,
        controllerAs: 'headVm',
        bindToController: true
    }
}
