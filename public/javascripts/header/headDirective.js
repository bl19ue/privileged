(function (){
    angular
        .module('myApp')
        .directive('bodyHeader', BodyHeader);

    BodyHeader.$inject = ['$state', '$rootScope', 'feedService', '$localStorage'];
    function BodyHeader($state, $rootScope, feedService, $localStorage) {
        function headController (){
            var headVm = this;
            var mainSidebar = false;
            var controlSidebar = false;

            headVm.searchString = null;
            headVm.search = search;
            headVm.toggleMainSidebar = toggleMainSidebar;
            headVm.toggleControlSidebar = toggleControlSidebar;
            headVm.goHome = goHome;

            function goHome() {
                $state.go('home');
            }

            function toggleMainSidebar() {
                $rootScope.$broadcast('toggle-main-sidebar', !mainSidebar);
            }
            function toggleControlSidebar() {
                $rootScope.$broadcast('toggle-control-sidebar', !controlSidebar);
            }
            function search(){
                console.log("Searching....");
                headVm.searchArr = [];
                headVm.searchArr.push(headVm.searchString);
                feedService.getFeeds($localStorage.user.token, headVm.searchArr, 0).then(function (response){
                    $rootScope.$broadcast('searchFeed', response);
                });
            }
        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/partials/header.ejs',
            controller: headController,
            controllerAs: 'headVm',
            bindToController: true
        }
    }
})();