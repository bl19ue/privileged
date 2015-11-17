/**
 * Created by Neeraj on 11/17/2015.
 */
angular
    .module('myApp')
    .controller('dialogCtrl', DialogCtrl);

    DialogCtrl.$inject = ['$mdDialog'];

    function DialogCtrl ($mdDialog) {
        var vm = this;
        vm.hide = function() {
            $mdDialog.hide();
        };
        vm.cancel = function() {
            $mdDialog.cancel();
        };
        vm.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }