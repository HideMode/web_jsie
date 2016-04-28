define("app/routes", ["angular", "uiRouter"], function(angular) {
    angular
        .module('app.routes', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('register', {
                url: "/register",
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/register.html'
            })
            .state('login', {
                url: '/login?redirect',
                controller: 'LoginController',
                controllerAs: 'loginCtrl',
                templateUrl: '/static/templates/authentication/login.html'
            })
            .state('course', {
                url: '/course?id',
                templateUrl: '/static/templates/course/courselist.html',
                controller: 'CourseController',
                controllerAs: 'courseCtrl'
            })
            .state('chapter', {
                url: '/chapter/:id',
                templateUrl: '/static/templates/course/course_chapter.html',
                controller: 'ChapterController',
            })
            .state('view', {
                url: '/view/:id',
                templateUrl: '/static/templates/course/chapter_detail.html',
                controller: 'ViewController as vm'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/static/templates/account/settings.html'
            })
            .state('settings.avatar', {
                url: '/avatar',
                templateUrl: '/static/templates/account/settings/settings-avatar.html',
                controller: 'AvatarController'
            })
            .state('settings.password', {
                url: '/password',
                templateUrl: '/static/templates/account/settings/settings-password.html',
                controller: 'PassWordController'
            })
            .state('settings.feedback', {
                url: '/feedback',
                templateUrl: '/static/templates/account/settings/settings-feedback.html'
            })
            .state('account', {
                url: '/account',
                templateUrl: '/static/templates/account/account.html',
                controller: 'AccountController'
            })
            .state('search', {
                url: '/search?search',
                templateUrl: '/static/templates/course/explore.html',
                controller: 'SearchController'
            })
            $urlRouterProvider.otherwise("course");
        })
})