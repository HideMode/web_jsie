define("course/course/service", ["angular"], function(angular) {
    return angular
        .module('app.course.services', [])
        .factory('Course', ['$http', '$q', function($http, $q) {
            return {
                getSubNav: function() {
                    var d = $q.defer();
                    return $http.get('/api/v1/categories/')
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getCourseList: function(page, id, search) {
                    var d = $q.defer();
                    return $http.get('/api/v1/courses/', {
                            params: {
                                page: page,
                                cate_id: id,
                                search: search || ''
                                    // page_size: 1
                            }
                        })
                        .success(function(data) {
                            d.resolve(data.results);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getCourseById: function(course_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/courses/' + course_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getCourseChapterById: function(chapter_id) {
                    var d = $q.defer();
                    return $http.get('api/v1/chapters/' + chapter_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                changeStatus: function(course_id) {
                    var d = $q.defer();
                    return $http.post('/course/change/status/', {
                            course_id: course_id
                        })
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                }
            };
        }])

})