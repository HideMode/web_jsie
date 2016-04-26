define("app/course", ["angular", "course/directives", "course/comment/service", "course/course/service", "course/chapter/contorller", "course/course/controller",  "course/view/contorller", "course/search/controller"], function(angular) {
    return angular
        .module('app.course', [
            'app.course.controllers',
            'app.course.directives',
            'app.course.chapter.controllers',
            'app.course.chapter.view.controllers',
            'app.course.search.controllers',
            'app.course.services',
            'app.course.comment.services'
        ]);
})