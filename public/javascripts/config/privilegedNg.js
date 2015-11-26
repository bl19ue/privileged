angular
    .module('myApp')
    .config(configure);

configure.$inject = ['$stateProvider', '$urlRouterProvider'];

function configure($stateProvider, $urlRouterProvider){
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/partials/login.ejs',
        controller: 'loginController',
        resolve: {
            isNotAuthorized: isNotAuthorized
        }
    });
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: '/partials/register.ejs',
        controller: 'registerController',
        controllerAs: 'registerVm',
        resolve: {
            isNotAuthorized: isNotAuthorized
        }
    });
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: '/partials/home.ejs',
        controller: 'feedController',
        controllerAs: 'feedVm',
        resolve: {
            isAuthenticated: isAuthenticated,
            feedsProv: getProblemFeeds
        }
    });
    $stateProvider.state('problem', {
        url: '/problem',
        templateUrl: '/partials/problem.ejs',
        controller: 'problemController',
        controllerAs: 'problemVm',
        resolve: {
            isAuthenticated: isAuthenticated
        }
    });
    $stateProvider.state('team', {
        url: '/team',
        templateUrl: '/partials/team.ejs',
        controller: 'teamController',
        controllerAs: 'teamVm',
        resolve: {
            isAuthenticated: isAuthenticated
        }
    });
    $stateProvider.state('problem-detail', {
        templateUrl: '/partials/problemDetails.ejs',
        controller: 'problemController',
        controllerAs: 'problemVm',
        params: {'data': null},
        resolve: {
            isAuthenticated: isAuthenticated
        }
    });
    $stateProvider.state('statistic', {
        url: '/stats',
        templateUrl: '/partials/statistic.ejs',
        controller: 'statController',
        controllerAs: 'statVm',
        resolve: {
            isAuthenticated: isAuthenticated
        }
    });
    $urlRouterProvider.otherwise('home');
}

getProblemFeeds.$inject = ['$localStorage', 'feedService'];

function getProblemFeeds($localStorage, feedService) {
    var token = $localStorage.user.token;
    return feedService.getFeeds(token, [], 0);
}

isAuthenticated.$inject = ['$localStorage', '$location'];

function isAuthenticated($localStorage, $location) {
    if($localStorage.user) {
        return true;
    } else {
        $location.path('/login');
    }
}

isNotAuthorized.$inject = ['$localStorage', '$location'];

function isNotAuthorized($localStorage, $location) {
    if($localStorage.user) {
        $location.path('/home');
    }

    return true;
}