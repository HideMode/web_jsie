define("course/directives", ["angular", "tinyMce", "ngCookies", "course/course/service", "authentication/service", "course/comment/service"], function(angular) {
    return angular
        .module('app.course.directives', [])
        .directive("courseSubNav", ['Course', '$timeout', '$window', '$document', function(Course, $timeout, $window, $document) {

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
            var setFixed = function(scope) {
                var t = $(document).scrollTop();
                if (t > 80) {
                    var width1 = $("nav.course-sidebar").width();
                    var width2 = $(".course-tools").width();
                    $(".course-sidebar,.course-tools").addClass('fixed');
                    $(".course-sidebar").width(width1);
                    $(".course-tools").width(width2);
                    $(".course-list").css({
                        marginTop: 50
                    })
                } else {
                    $(".course-sidebar,.course-tools").removeClass('fixed');
                    $(".course-list").css({
                        marginTop: 0
                    })
                }

                var h = $(document).height();
                var wh = $(window).height();
                if (t >= h - wh - 30 && !scope.onLoad) {
                    scope.page += 1;
                    scope.$apply();
                }
            }

            function bindEvent(scope) {
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
                    if ($(this).hasClass('first-item')) {
                        $(".menu-item").removeClass('selected');
                        obj.find(".course-subcategory").show()
                        obj.addClass('selected');
                        changeToolsTitle();
                    }

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
                });
            }

            return {
                restrict: 'EA',
                templateUrl: '/static/templates/course/sub_nav.html',
                scope: {
                    categoryId: '=',
                    page: '=',
                    onLoad: '='
                },
                controller: function($scope, $element, $attrs) {
                    var vm = this;
                    Course.getSubNav().then(function(data) {
                        vm.subnav_list = data;
                    });
                    vm.changeCategory = function(id) {
                        $scope.categoryId = id;
                    };
                },
                controllerAs: 'vm',
                link: function(scope) {
                    bindEvent(scope);
                    angular.element($window).bind("scroll", function() {
                        setFixed(scope);
                    });
                    scope.$on('$destroy', function() {
                        angular.element($window).unbind('scroll');
                    });
                }
            }
        }])
        .directive("tinyMce", ["$compile", "$state", "$location", "Authentication",
            function($compile, $state, $location, Authentication) {
                return {
                    restrict: "EA",
                    scope: {
                        chapterId: '@',
                        addComment: '&'
                    },
                    template: '<textarea ng-model="content" id="mce-textarea"></textarea>\
                            <div class="form-command"><span>\
                            <button ng-click="redirectToLogin()" ng-show="!is_authenticated" class="submit-button btn btn-warning" \
                            >登陆后提交</button></span>\
                            <span><button ng-click="content && createComment()" ng-show="is_authenticated"\
                             class="submit-button btn" ng-class="{\'btn-warning\': !content, \'btn-primary\': !!content}">发布评论</button></span></div>',
                    link: function(scope, iElement, attrs) {
                        tinymce.init({
                            selector: '#mce-textarea',
                            menubar: false,
                            statusbar: false,
                            setup: function(editor) {
                                editor.on('change', function(event) {
                                    var content_text = editor.getContent({
                                        format: 'text'
                                    });
                                    var content = editor.getContent({
                                        format: 'raw'
                                    });
                                    scope.content = content_text.trim() ? content.trim() : "";
                                    scope.$apply();
                                });
                                scope.$watch('content', function(newValue, oldValue) {
                                    if (newValue == '') {
                                        editor.setContent('');
                                    }
                                })
                            }
                        });
                    },
                    controller: function($scope, $element, $attrs) {
                        $scope.is_authenticated = Authentication.isAuthenticatedAccount();
                        $scope.redirectToLogin = function() {
                            var redirect = $location.url();
                            $location.url('/login' + '?redirect=' + redirect);
                        }
                        $scope.createComment = function() {
                            $scope.addComment({
                                content: $scope.content
                            })
                            $scope.content = ""

                        }
                    },
                    controllerAs: 'vm',
                };
            }
        ])
        .directive('showReply', ["$compile", 'Course', 'Authentication', 'Comment',
            function($compile, Course, Authentication, Comment) {
                return {
                    restrict: "EA",
                    scope: {
                        replyCount: '=',
                        commentId: '@'
                    },
                    link: function(scope, element, attrs) {
                        var replyftTpl = '<div class="comment-box-input"><div class="form-group">\
                                        <input type="text" ng-maxlength="replymax" ng-model="content" class="form-control" placeholder="写下你的评论..." required></div>\
                                        <div class="command">\
                                        <a ng-show="is_authenticated" class="r btn btn-primary" ng-click="addNew($event)" role="button" id="addNew" href="javascript:void(0)">评论</a>\
                                        <a class="r command-cancel" name="closeform" href="#">取消</a></div></div></div>';

                        $('.comment-list').delegate('.comment-box-input input.form-control', 'focus', function(event) {
                            event.preventDefault();
                            $(this).closest('.comment-box-input').addClass('expanded')
                        });
                        $('.comment-list').delegate('.comment-box-input-inline input.form-control', 'focus', function(event) {
                            event.preventDefault();
                            $(this).closest('.comment-box-input-inline').addClass('expanded')
                        });
                        $('.comment-list').delegate('.command-cancel', 'click', function(event) {
                            event.preventDefault();
                            $(this).closest('.comment-box-input').removeClass('expanded');
                            var $node = $(this).closest('.comment-box-input');
                            var $nodeInline = $(this).closest('.comment-box-input-inline');
                            $node.find('input.form-control').val(null)
                            $nodeInline.find('input.form-control').val(null)
                        });
                        scope.addNew = function($event) {
                            var $this = $($event.target);
                            var $node = $this.closest('.comment-box-input');
                            var $metaParent = $node.closest('.item-comment').find('.comment-item-meta');
                            var $meta = $metaParent.find('a.meta-item');
                            var data = {
                                    comment: scope.commentId
                                }
                                // var content = $node.find('input.form-control').val();
                            var content = scope.content;
                            if (content.trim()) {
                                data.content = content.trim();
                                Comment.addReply(data).then(function(data) {
                                    scope.replyCount += 1;
                                    $node.remove();
                                });
                            }
                        };

                        element.click(function(e) {
                            e.stopPropagation()
                            var num = parseInt(scope.replyCount);
                            var $node = $(this).closest('.media-body');
                            if ($node.hasClass('open')) {
                                $node.removeClass('open')
                                $node.find('.comment-box').remove();
                            } else {
                                $node.addClass('open')
                                    // $(this).html("<span class='glyphicon glyphicon-comment'><span>收起评论")
                                var $node = $(this).closest('.media-body');
                                if (num <= 0) {
                                    var hasBox = $node.find('.comment-box-input').length > 0 ? true : false;
                                    if (!hasBox) {
                                        var temp = $compile(replyftTpl)(scope);
                                        $node.append(temp);
                                    }

                                } else {
                                    var temp = $compile('<reply-list reply-count="replyCount" comment-id="{{commentId}}"></reply-list>')(scope);
                                    $node.append(temp);
                                }
                            }
                        })
                    },
                    controller: function($scope, $element, $attrs) {
                        $scope.is_authenticated = Authentication.isAuthenticatedAccount();
                        $scope.replymax = 100;
                    }
                }
            }
        ])
        .directive('replyList', ["$compile", '$timeout', 'Comment', 'Authentication',
            function($compile, $timeout, Comment, Authentication) {
                return {
                    restrict: "E",
                    scope: {
                        commentId: '@',
                        replyCount: '='
                    },
                    templateUrl: '/static/templates/course/reply_list.html',
                    replace: true,
                    link: function(scope, element, attrs) {
                        var replyftTpl_insert = '<div class="comment-box-input"><div class="form-group">\
                                        <input type="text" ng-maxlength="replymax" ng-model="reply" class="form-control" placeholder="写下你的回复..." required></div>\
                                        <div class="command">\
                                        <a ng-show="is_authenticated" ng-click="addReply($event)" class="r btn btn-primary" role="button" id="addReply" href="javascript:void(0)">回复</a>\
                                        <a class="r command-cancel" name="closeform" href="#">取消</a></div></div></div>';
                        scope.showInput = function($event) {
                            var $this = $($event.currentTarget);
                            var $node = $this.closest('.reply-body');
                            if ($node.find('.comment-box-input').length) {
                                $node.hasClass('open') ? $node.removeClass('open') : $node.addClass('open');
                            } else {
                                var temp = $compile(replyftTpl_insert)(scope);
                                $(temp).find('#addReply').data('reply', $this.data('reply'));
                                $node.append(temp).addClass('open');
                            }
                        }
                        scope.addReply = function($event) {
                            var $this = $($event.target);
                            var $node = $this.closest('.comment-box-input');
                            var $mediaBody = $this.closest('.reply-body');
                            var $meta = $node.siblings('.reply-item-meta').find('a.meta-item');
                            var data = {
                                comment: scope.commentId,
                                parent: $this.data('reply')
                            }
                            var content = $node.find('input.form-control').val();
                            if (content.trim()) {
                                data.content = content.trim();
                                Comment.addReply(data).then(function(data) {
                                    scope.replys.unshift(data);
                                    scope.replyCount += 1;
                                    $node.find('input.form-control').val("");
                                    $mediaBody.removeClass('open');

                                });
                            }

                        }
                        scope.addNew = function($event) {
                            var $this = $($event.target);
                            var $node = $this.closest('.comment-box-input-inline');
                            var $metaParent = $node.closest('.item-comment').find('.comment-item-meta');
                            var $meta = $metaParent.find('a.meta-item');
                            var data = {
                                    comment: scope.commentId
                                }
                                // var content = $node.find('input.form-control').val();
                            var content = scope.content;
                            if (content.trim()) {
                                data.content = content.trim();
                                Comment.addReply(data).then(function(data) {
                                    scope.replyCount += 1;
                                    $node.find('input.form-control').val("");
                                    scope.replys.unshift(data);
                                    // $node.remove();
                                });
                            }
                        };
                    },
                    controller: function($scope) {
                        $scope.onLoad = !0;
                        $scope.replymax = 10
                        $scope.is_authenticated = Authentication.isAuthenticatedAccount();
                        Comment.getReplys($scope.commentId).then(function(data) {
                            $scope.replys = data;
                            $timeout(function() {
                                $scope.onLoad = !1;
                            }, 500);
                        });
                    }
                }
            }
        ]);
})