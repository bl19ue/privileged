angular
    .module('myApp')
    .controller('projectCtrl', ProjectCtrl);

    ProjectCtrl.$inject = ['$state'];

    function ProjectCtrl($state) {
        var vm = this;
        vm.demo = "demo";
        vm.register = function() {
            $state.go('register');
        };
        vm.login = function() {
            $state.go('login');
        };
    }