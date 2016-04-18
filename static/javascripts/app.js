define("app", ["angular", "ngAnimate", "uiBootstrapTpls", "layout/app", "authentication/app", "app/routes", "app/course"], function(angular) {
    return angular
        .module('app', [
            'ui.bootstrap',
            'app.routes',
            'ngAnimate',
            'app.authentication',
            'app.course',
            'app.layout'
        ])
        .run(['$http', function($http) {
            $http.defaults.xsrfHeaderName = 'X-CSRFToken'
            $http.defaults.xsrfCookieName = 'csrftoken'
        }]);
})