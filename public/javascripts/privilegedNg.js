var app = angular.module('myApp', ['ui.router', 'ngMaterial']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/partials/home.ejs',
            controller: 'homeCtrl'
        });

        $urlRouterProvider.otherwise('home');
    }
]);