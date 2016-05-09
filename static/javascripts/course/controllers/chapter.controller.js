define("course/chapter/contorller", ["angular", "ngSanitize", "authentication/service", "course/course/service", "components/snackbar/service"], function(angular) {

    return angular
        .module('app.course.chapter.controllers', ['ngSanitize'])
        .controller('ChapterController', ['$scope', '$rootScope', 'Authentication', 'Course', '$stateParams', 'Snackbar',
            function($scope, $rootScope, Authentication, Course, $stateParams, Snackbar) {
                // var vm = this;
                var course_id = parseInt($stateParams.id);
                $rootScope.$watch('currentUser', function(nv, ov) {
                    $scope.is_authenticated = $rootScope.currentUser;
                })
                $scope.course_list = $rootScope.currentUser.course || [];
                $scope.$watchCollection('course_list', function(nv, ov) {
                    $scope.is_follow = nv.indexOf(course_id) == -1 ? !1 : !0;
                })
                Course.getCourseById(course_id).then(function(data) {
                    $scope.course = data;
                });

                // follow or un follow func
                $scope.changeStatus = function() {
                    Course.changeStatus(course_id).then(function(data) {
                        if (data.success) {
                            Snackbar.show(data.msg);
                            if (data.follow) {
                                // follow 
                                $scope.course_list.push(course_id);
                            } else {
                                var index = $scope.course_list.indexOf(course_id);
                                $scope.course_list.splice(index, 1)
                            }
                        } else {
                            Snackbar.error(data.msg);
                        }
                    });
                };
            }
        ]);
})