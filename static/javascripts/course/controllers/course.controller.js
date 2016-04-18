(function() {
    'use strict';

    angular
        .module('app.course.controllers')
        .controller('CourseController', ['$location', '$scope', 'Course', function($location, $scope, Course) {
            $scope.page = 1;
            $scope.category = 0;
            $scope.onLoad = !1;
            $scope.$watch('page', function(newV, oldV){
                $scope.onLoad = !1;
                if (newV == oldV || $scope.page == 1){
                    return;
                }else{
                    $scope.getCourse(newV, $scope.category);
                }
            });
            $scope.$watch('category', function(newV, oldV){
                $scope.onLoad = !1;
                if (newV == oldV){
                    return;
                }else{
                    $scope.page = 1;
                    $scope.getCourse($scope.page, newV);
                }
            });
            $scope.getCourse = function(page, category){
                page = page || 1, category = category || 0;
                $scope.onLoad = !0;
                Course.getCourseList(page, category).then(function(data){
                    if (page==1){
                        $scope.course_list = data;
                    }else{
                        $scope.course_list = $scope.course_list.concat(data)
                    }
                    $scope.onLoad = !1;
                }, function(data){
                    $scope.onLoad = !1;
                });
            }
            $scope.getCourse(1, 0);
        }])
})();