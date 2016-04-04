(function () {
    'use strict';
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
                url: '/login',
                controller: 'LoginController',
                controllerAs: 'loginCtrl',
                templateUrl: '/static/templates/authentication/login.html'
            })
            .state('course', {
                url: '/course',
                templateUrl: '/static/templates/course/courselist.html',
                controller: 'CourseController',
                controllerAs: 'courseCtrl'
            })
            $urlRouterProvider.otherwise("/");
        })
})();