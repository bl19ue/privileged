/**
 * Created by Neeraj on 11/23/2015.
 */
angular
    .module('myApp')
    .controller('mfbController', MfbController);
MfbController.$inject = ['$state', 'userService']
function MfbController ($state, userService) {
    var mfb = this;
    mfb.logout = logout;
    mfb.addProblem = addProblem;
    mfb.showStat = showStat;
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
