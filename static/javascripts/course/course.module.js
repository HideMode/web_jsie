(function(){
    'use strict';
    angular
        .module('app.course', [
            'app.course.controllers',
            'app.course.directives',
            'app.course.chapter.controllers',
            'app.course.chapter.view.controllers',
            'app.course.services',
            'app.course.comment.services'
        ]);

    angular
        .module('app.course.controllers', []);
    angular
        .module('app.course.services', ['ngCookies']);
})();