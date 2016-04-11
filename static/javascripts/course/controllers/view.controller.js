(function(){
    'use strict';

    angular
        .module('app.course.chapter.view.controllers', ['ngSanitize'])
        .controller('ViewController', ['$stateParams', '$scope' , 'Course', function($stateParams, $scope, Course){
            var vm = this;
            var id = $stateParams.id;
            Course.getCourseChapterById(id).then(function(data){
                vm.detail = data;
                vm.link=JSON.parse(vm.detail.link);
                console.log(vm.link)
            });
        }])
})();