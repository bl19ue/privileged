angular.module('myApp')
    .controller('projectCtrl', ['$scope', '$state', function($scope, $state){
        $scope.demo = "demo";
        $scope.register = function() {
            $state.go('register');
        }
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
    });