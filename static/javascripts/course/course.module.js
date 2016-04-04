(function(){
    'use strict';
    angular
        .module('app.course', [
            'app.course.controllers',
            'app.course.services'
        ]);

    angular
        .module('app.course.controllers', []);
    angular
        .module('app.course.services', ['ngCookies']);
})();