angular.module('myApp')
    .controller('projectCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.demo = "demo";
        $scope.register = function() {
            $state.go('register');
        };
        $scope.login = function() {
            $state.go('login');
        };
        $scope.home = function() {
            $state.go('home');
        };
    }])
    .controller('loginCtrl',['$scope', '$mdDialog', function($scope, $mdDialog) {
        $scope.status = '  ';
        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: 'dialogCtrl',
                templateUrl: '/dialogBox/forgotPassword.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };
    }])
    .controller('registerCtrl', function(){
        var self = this;
        self.readonly = false;
        self.interests = ['java', 'angular', 'kafka'];

        self.roInterests = angular.copy(self.interests);
        self.tags = [];

        self.newInterest = function(chip) {
            return {
                name: chip,
                type: 'unknown'
            };
        };
    })
    .controller('dialogCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog) {
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }]);