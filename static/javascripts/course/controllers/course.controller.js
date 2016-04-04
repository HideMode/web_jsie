(function(){
    'use strict';

    angular
        .module('app.course.controllers')
        .controller('CourseController', ['$location', '$scope' , 'Course', function($location, $scope, Course){
            var vm = this;

            Course.getCourseList().then(function(data){
                vm.course_list = data;
            });
        }])
})();