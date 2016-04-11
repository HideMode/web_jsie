(function() {
    'use strict';

    angular
        .module('app.course.controllers')
        .directive("courseSubNav", ['Course', '$timeout', function(Course, $timeout) {

            function changeToolsTitle() {
                //页面导航
                var data = {
                    cateId: 0,
                    subCateId: 0,
                    pageSize: 15,
                    // page: page,
                }
                var title;
                var currObj = $(".course-silderbar .selected")
                var title1 = currObj.find("a:first").text();
                data.cateId = currObj.find("a:first").data('cateid') || 0;
                title = "<li><a>" + title1 + "</a></li>"
                var currSubObj = currObj.find("ul li.cur")
                if (currSubObj) {
                    var title2 = currSubObj.find("a:first").text()
                    data.subCateId = currSubObj.find("a:first").data("subid");
                    if (title2) {
                        title += '<li><a>' + title2 + '</a></li>'
                    }
                }
                $(".course-tools").html(title)
            }
            var setFixed = function() {
                var t = $(document).scrollTop();
                if (t > 80) {
                    var width1 = $("nav.course-sidebar").width();
                    var width2 = $(".course-tools").width();
                    $(".course-sidebar,.course-tools").addClass('fixed')
                    $(".course-sidebar").width(width1)
                    $(".course-tools").width(width2)
                    $(".course-list").css({
                        marginTop: 50
                    })
                } else {
                    $(".course-sidebar,.course-tools").removeClass('fixed')
                    $(".course-list").css({
                        marginTop: 0
                    })
                }

                var h = $(document).height()
                var wh = $(window).height()
                if (t >= h - wh - 30) {
                    if (nextPage > 0) {
                        // loadCourse(nextPage);
                    }
                }
            }

            function bindEvent() {
                var timer, timer1, timer2, point = [];
                $(".course-silderbar")
                    .on("mouseenter", ".course-sidebar",
                        function() {
                            alert('enter')
                            $timeout.cancel(timer2);
                        })
                    .on("mouseleave", ".course-sidebar",
                        function() {
                            alert('leave')
                            timer2 = $timeout(function() {
                                $(".course-silderbar .course-category").removeClass('hover')
                                $(".course-silderbar .course-subcategory").hide('slow');
                            }, 1000);
                        })

                $(".course-silderbar").on("click", ".menu-item", function(event) {
                    if (event.stopPropagation)
                        event.stopPropagation();
                    else
                        event.cancelBubble = true;
                    var obj = $(this);
                    $(".menu-item.selected").find('li.cur').removeClass('cur');
                    $(".menu-item").removeClass('selected');
                    obj.addClass('selected');
                    obj.find(".course-subcategory").show()
                    changeToolsTitle();
                    // loadCourse();
                })
                $(".course-silderbar").on("mouseenter", ".menu-item", function(event) {
                    var _this = $(this);
                    var _hover = function() {
                        $(".menu-item").removeClass('hover');
                        $(".course-subcategory").hide();
                        _this.addClass('hover')
                        _this.find(".course-subcategory").show()
                    }

                    timer = $timeout(function() {
                        _hover();
                        $timeout.cancel(timer1)
                    }, 10)

                    timer1 = $timeout(function() {
                        _hover()
                    }, 1000)
                }).on("mouseleave", ".menu-item", function() {
                    $timeout.cancel(timer);
                    $timeout.cancel(timer1);
                    $(this).removeClass('hover').find(".course-subcategory").hide()
                })
                $('.course-silderbar').on('click', '.course-subcategory li a', function(event) {
                    event.preventDefault();
                    if (event.stopPropagation)
                        event.stopPropagation();
                    else
                        event.cancelBubble = true;
                    var curObj = $('.menu-item.selected')
                    curObj.removeClass('selected')
                    curObj.find('li.cur').removeClass('cur')
                    var $this = $(this);
                    $this.parent('li').addClass('cur');
                    $this.closest('.menu-item').addClass('selected')
                    changeToolsTitle();
                    // loadCourse();
                });
                $(window).scroll(setFixed)
                setFixed();
                // loadCourse();
            }

            return {
                restrict: 'EA',
                templateUrl: '/static/templates/course/sub_nav.html',
                controller: function($scope, $element, $attrs) {
                    var vm = this;
                    // all filter
                    // var vm.selected;

                    Course.getSubNav().then(function(data) {
                        vm.subnav_list = data;
                    });
                },
                controllerAs: 'vm',
                link: function(scope) {
                    bindEvent(scope);
                }
            }
        }])
})();