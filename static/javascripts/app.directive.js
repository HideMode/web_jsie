(function(){
    'use strict';
    /*
        表单验证自定义指令
    */
    angular
    .module('app.directives', [])
    .directive('fieldError', function(){
        return{
            restrict: 'EA',
            require: 'ngModel',
            // link函数会在当前指令初始化的时候被自动执行
            link: function(){
                
            }
        };
    });
});