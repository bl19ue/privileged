/**
 * Created by Neeraj on 11/23/2015.
 */

angular
    .module('myApp')
    .directive('floatingBtn', FloatBtn);
    FloatBtn.$inject = ['$state', 'userService'];
    function FloatBtn($state, userService) {
        function MfbController(){
            var mfbVm = this;
            mfbVm.showStat = showStat;
            mfbVm.addProblem = addProblem;
            mfbVm.logout = logout;
            function logout() {
                if(userService.logout()) {
                    $state.go('login');
                }
            };
            function addProblem() {
                $state.go('problem');
            };
            function showStat() {
                $state.go('statistic');
            };
        }

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/components/mfb.html',
            controller: MfbController,
            controllerAs: 'mfb',
            bindToController: true
        }
    }