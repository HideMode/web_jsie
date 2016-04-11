(function(){
    'use strict';
    angular
    .module('app.course.services')
    .factory('Course', ['$http', '$q', function($http, $q){
        return {
            getSubNav: function(){
                var d = $q.defer();
                return $http.get('/api/v1/categories/')
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
            },
            getCourseList: function(page, filter){
                var d = $q.defer();
                return $http.get('/api/v1/courses/')
                    .success(function(data){
                        d.resolve(data);
                    })
                    .error(function(err){
                        d.reject(err);
                    }), d.promise;
            },
            getCourseById: function(course_id){
                var d = $q.defer();
                return $http.get('/api/v1/courses/'+course_id)
                        .success(function(data){
                            d.resolve(data);
                        })
                        .error(function(err){
                            d.reject(err);
                        }), d.promise;
            },
            getCourseChapterById: function(chapter_id){
                var d = $q.defer();
                return $http.get('api/v1/chapters/'+chapter_id)
                        .success(function(data){
                            d.resolve(data);
                        })
                        .error(function(err){
                            d.reject(err);
                        }), d.promise;
            }
        };
    }])

})();