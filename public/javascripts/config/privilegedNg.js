angular
    .module('myApp')
    .config(configure);

configure.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

function configure($stateProvider, $urlRouterProvider, $locationProvider){
    // enable HTML% mode to remove hashbang (#!) from the url
    $locationProvider.html5Mode(true).hashPrefix('!');
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: '/partials/login.ejs',
        controller: 'loginController',
        controllerAs: 'loginVm',
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
            feedsProv: getProblemFeeds,
            myFeedsProv: getProblemList
        }
    });
    $stateProvider.state('problem', {
        url: '/problem',
        templateUrl: '/partials/problem.ejs',
        controller: 'problemController',
        controllerAs: 'problemVm',
        params: {'data': null},
        resolve: {
            isAuthenticated: isAuthenticated,
            problemDetailProvider: getProblemDetail,
            teamsProvider: getTeams
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
            isAuthenticated: isAuthenticated,
            problemDetailProvider: getProblemDetail,
            teamsProvider: getTeams
        }
    });
    $stateProvider.state('statistic', {
        url: '/stats',
        templateUrl: '/partials/statistic.ejs',
        controller: 'statsController',
        controllerAs: 'statsVm',
        resolve: {
            isAuthenticated: isAuthenticated,
            statsProvider: getStats
        }
    });
    $urlRouterProvider.otherwise('login');
}


getTeams.$inject = ['$stateParams', 'problemService'];
function getTeams($stateParams, problemService) {
    if($stateParams.data != null) {
        var problemId = $stateParams.data._id;
        return problemService.getTeams(problemId);
    }
}

getProblemDetail.$inject = ['$stateParams', 'problemService'];
function getProblemDetail($stateParams, problemService) {
    if($stateParams.data !== null){
        var problemId = $stateParams.data._id;
        console.log(problemId);
        return problemService.getProblem(problemId);
    }
}

getProblemFeeds.$inject = ['$localStorage', 'feedService'];
function getProblemFeeds($localStorage, feedService) {
    var token = $localStorage.user.token;
    return feedService.getFeeds(token, [], 0);
}

getProblemList.$inject = ['$localStorage', 'problemService'];
function getProblemList($localStorage, problemService){
    var token = $localStorage.user.token;
    return problemService.myProblemList(token);
}

isAuthenticated.$inject = ['$localStorage', '$location', '$state'];

function isAuthenticated($localStorage, $location, $state) {

    if($localStorage.user) {
        return true;
    } else {
        //$location.path('/login');
        $state.go('login');
    }
}

isNotAuthorized.$inject = ['$localStorage', '$location'];
function isNotAuthorized($localStorage, $location) {
    if($localStorage.user) {
        $location.path('/home');
    }

    return true;
}

getStats.$inject = ['statsService'];
function getStats(statsService) {
    return statsService.getStatistics();
}