define("course/search/controller", ["angular", "ngSanitize", "course/course/service"], function(angular) {
    return angular
        .module('app.course.search.controllers', ['ngSanitize'])
        .controller('SearchController', ['$location', '$scope', 'Course', function($location, $scope, Course) {
            var search = $location.search();
            var key_words = search.search || '';
            console.log(search)
            Course.getCourseList(1, 0, key_words).then(function(data){
                $scope.course_list = data;
            })
        }])
})