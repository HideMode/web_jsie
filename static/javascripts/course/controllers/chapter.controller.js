(function(){
    'use strict';

    angular
    .module('app.course.chapter.controllers', ['ngSanitize'])
    .controller('ChapterController', ['Authentication' , 'Course', '$stateParams',
        function(Authentication, Course, $stateParams){
            var vm = this;
            var course_id = $stateParams.id;
            vm.is_authenticated = Authentication.isAuthenticatedAccount();
            Course.getCourseById(course_id).then(function(data){
                vm.course = data;
            });
        }]);
})();