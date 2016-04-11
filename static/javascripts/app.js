(function() {
    'use strict';
    angular
        .module('app', [
            'ui.bootstrap',
            'app.routes',
            'ngAnimate',
            // 'app.config',
            'app.authentication',
            'app.course',
            'app.layout',
            'ngMessages'
        ])
        .run(['$http', function($http){
            $http.defaults.xsrfHeaderName = 'X-CSRFToken'
            $http.defaults.xsrfCookieName = 'csrftoken'
        }])
})();