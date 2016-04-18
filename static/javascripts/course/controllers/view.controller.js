define("course/view/contorller", ["angular", "ngSanitize", "course/course/service", "course/comment/service"], function(angular) {
    return angular
        .module('app.course.chapter.view.controllers', ['ngSanitize'])
        .controller('ViewController', ['$stateParams', '$scope', 'Course', 'Comment',
            function($stateParams, $scope, Course, Comment) {
                var vm = this;
                vm.popover_temp = "myPopoverTemplate.html"
                var id = $stateParams.id;
                Course.getCourseChapterById(id).then(function(data) {
                    vm.detail = data;
                    vm.link = JSON.parse(vm.detail.link);
                });
                Comment.getComments(id).then(function(data) {
                    vm.comments = data;
                });
                vm.addComment = function(content) {
                    var data = {
                        // 'chapter_id':
                        chapter: vm.detail.id,
                        content: content,
                        reply_count: 0
                    }
                    Comment.addComment(data).then(function(data) {
                        vm.comments.unshift(data)
                    });
                };
                vm.addReply = function() {
                    console.log('add reply')
                        // Comment.addReply().then(function(data){

                    // });
                };
            }
        ])
})