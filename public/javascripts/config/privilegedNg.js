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
    $stateProvider.state('problem', {
        url: '/problem',
        templateUrl: '/partials/problem.ejs',
        controller: 'problemController',
        controllerAs: 'problemVm'
    });
    $urlRouterProvider.otherwise('register');
}

getProblemFeeds.$inject = ['userService', 'feedService'];

function getProblemFeeds(userService, feedService) {
    return feedService.getFeeds(userService.user.token, [], 0);
}
