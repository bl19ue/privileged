var app = angular.module('myApp', ['ui.router', 'ngMaterial']);

app.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: '/partials/login.ejs',
            controller: 'loginCtrl'
        });
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: '/partials/register.ejs',
            controller: 'registerCtrl'
        });
        $stateProvider.state('home', {
            url: '/home',
            templateUrl: '/partials/home.ejs',
            controller: 'homeCtrl'
        });
        $urlRouterProvider.otherwise('register');
    }
]);