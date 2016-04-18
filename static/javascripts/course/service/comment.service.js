define("course/comment/service", ["angular"], function(angular) {
    return angular
        .module('app.course.comment.services', [])
        .factory('Comment', ['$http', '$q', function($http, $q) {
            return {
                getComments: function(chapter_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/comments/?chapter_id=' + chapter_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                getReplys: function(comment_id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/replys/?comment_id=' + comment_id)
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                // 
                addComment: function(data) {
                    var d = $q.defer();
                    return $http.post('/api/v1/comments/', data)
                        .success(function(res) {
                            d.resolve(res);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                },
                // 
                addReply: function(data) {
                    var d = $q.defer();
                    return $http.post('/api/v1/replys/', data)
                        .success(function(res) {
                            d.resolve(res);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
                }
            };
        }])

})