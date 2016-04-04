(function(){
    'use strict';

    angular
        .module('app.course.controllers')
        .controller('SubNavController', ['$location', '$scope' , 'Course', function($location, $scope, Course){
            var vm = this;
            // all filter
            // var vm.selected;

            Course.getSubNav().then(function(data){
                vm.subnav_list = data;
            });

            vm.isActive = function(index){
                if(!vm.selected){
                    vm.selected = 0;
                }
                return index === vm.selected;
            }

            vm.setActive = function(index){
                vm.selected = index;
            }

            vm.isShowSub = function(index){
                
            }


            function moveToActive(bottom) {
                $("li.navbar-current").stop(!0, !0).animate({
                    bottom: bottom
                }, "fast")
            }

            function mouseEnterAction() {
                var bottom = $(this).position().bottom;
                moveToActive(bottom)
            }

            function mouseLeaveAction() {
                for (var navItems = $("ul.navbar-nav-bottom li.navbar-nav-item"), i = 0, 
                    length = navItems.length; length > i; i++)
                    if ($(navItems[i]).find(".active").length > 0) {
                        var position = $(navItems[i]).position(),
                            bottom = position ? position.bottom : 0;
                        return void moveToActive(bottom)
                    }
            }

            function navDownAction() {
                for (var navItems = $(".menu-item .course-subcategory li"), i = 0, length = navItems.length; 
                    length > i; i++) 
                    $(navItems[i]).find(".cur").length > 0 ? 
                    $(navItems[i]).addClass("dropitem-current") : 
                    $(navItems[i]).removeClass("dropitem-current")
            }
        }])
})();