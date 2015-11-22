angular
    .module('myApp')
    .config(configure);

configure.$inject = ['$stateProvider', '$urlRouterProvider'];

function configure($stateProvider, $urlRouterProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/partials/login.ejs',
        controller: 'loginController'
    });
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: '/partials/register.ejs',
        controller: 'registerController'
    });
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/partials/home.ejs',
        controller: 'feedController',
        controllerAs: 'feedVm',
        resolve: {
            feedsProv: getProblemFeeds
        }
    });
    $urlRouterProvider.otherwise('register');
}

getProblemFeeds.$inject = ['$localStorage', 'feedService'];

function getProblemFeeds($localStorage, feedService) {
    var token = $localStorage.user.token;
    return feedService.getFeeds(token, [], 0);
}
