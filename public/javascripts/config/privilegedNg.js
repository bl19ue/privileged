app.config([
    '$stateProvider',
    '$urlRouterProvider',
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
            controller: 'homeCtrl',
            resolve: {
                problem_feeds: ['feeds', 'user', function(feeds, user) {
                    return feeds.getfeeds(user.token, [], 0);
                }]
            }
        });
        $urlRouterProvider.otherwise('register');
    }
]);