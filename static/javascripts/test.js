define("account/cropper/directive", ["angular", "underscore"], function(angular, _) {
    return angular
        .module('account.directive', [])
        .directive("croperPhoto", ["$compile", "employeeNetService", "$parse", "$timeout", "gintDialog",
            function($compile, employeeNetService, $parse, $timeout, gintDialog) {
                return {
                    restrict: "EA",
                    templateUrl: "components/cropper/template.html",
                    scope: {
                        imageUrl: "=",
                        jsonImageData: "="
                    },
                    link: function($scope, iElement) {
                        var $image = iElement.find("#_cropper-container > img"),
                            $inputImage = iElement.find("#fileInput");
                        $image.attr("src", $scope.imageUrl), $image.cropper({
                            aspectRatio: 1,
                            preview: ".account-head-pic",
                            checkImageOrigin: !1,
                            crop: function(data) {
                                $scope.$root.$$phase || $scope.$apply(function() {
                                    $scope.jsonImageData = {
                                        url: $scope.imageUrl,
                                        x: Math.round(data.x),
                                        y: Math.round(data.y),
                                        width: Math.round(data.width),
                                        height: Math.round(data.height)
                                    }
                                })
                            },
                            built: function() {}
                        }), $inputImage.change(function() {
                            var file = this.files[0];
                            return "image/bmp" != file.type && "image/jpg" != file.type && "image/jpeg" != file.type && "image/png" != file.type ? void gintDialog.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！", 1) : file.size > 4194304 ? void gintDialog.error("图片文件大小超过4M!", 1) : (employeeNetService.uploadImage(file).then(function(result) {
                                result = result.data, result.status ? $scope.imageUrl = result.data.url : gintDialog.error(result.message, 1)
                            }, function() {
                                gintDialog.error("网络异常，上传失败", 1)
                            }), void $inputImage.val(""))
                        }), $scope.changeImage = function(e) {
                            e.stopPropagation(), e.preventDefault(), $inputImage.click()
                        }, $scope.$watch("imageUrl", function(nv, ov) {
                            nv !== ov && $image.cropper("replace", nv)
                        })
                    }
                }
            }
        ])
}),define("authentication/app", ["angular", "authentication/controller/login", "authentication/controller/register", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication', [
            'app.authentication.controllers',
            'app.authentication.services'
        ]);
}),define("app/course", ["angular", "course/directives", "course/comment/service", "course/course/service", "course/chapter/contorller", "course/course/controller",  "course/view/contorller"], function(angular) {
    return angular
        .module('app.course', [
            'app.course.controllers',
            'app.course.directives',
            'app.course.chapter.controllers',
            'app.course.chapter.view.controllers',
            'app.course.services',
            'app.course.comment.services'
        ]);
}),define("course/directives", ["angular", "tinyMce", "ngCookies", "course/course/service", "authentication/service", "course/comment/service"], function(angular) {
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
}),define("layout/app", ["angular", "layout/navbar/controller"], function(angular) {
    return angular
        .module('app.layout', [
            'app.layout.controllers'
        ]);
}),define("authentication/controller/login", ["angular", "ngCookies", "authentication/service"], function() {

    return angular
        .module('app.authentication.controllers', [])
        .controller('LoginController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
            var vm = this;
            activate();
            vm.login = function() {
                Authentication.login(vm.email, vm.password);
            }

            function activate() {
                if (Authentication.isAuthenticatedAccount()) {
                    $location.url('/');
                }
            }
        }])
}),define("authentication/controller/register", ["angular", "ngCookies", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication.controllers', [])
        .controller('RegisterController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
            var vm = this;
            vm.register = function() {
                Authentication.register(vm.email, vm.password, vm.username);
            }
        }]);
}),define("authentication/service", ["angular", "ngCookies"], function(angular) {

    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$location', '$state', '$window', function($cookies, $http, $location, $state, $window) {
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount
                    // setAuthenticateAccount: setAuthenticateAccount,
                    // unauthenticate: unauthenticate
            }

            function register(email, password, username) {
                return $http.post('/api/v1/accounts/', {
                    username: username,
                    password: password,
                    email: email
                }).then(registerSuccessFn, registerErrorFn);

                function registerSuccessFn(data, status, headers, config) {
                    login(email, password);
                }

                function registerErrorFn(data, status, headers, config) {
                    console.log('register failed');
                }
            }

            function login(email, password) {
                return $http.post('/api/v1/auth/login/', {
                    email: email,
                    password: password
                }).then(loginSuccessFn, loginErrorFn);

                function loginSuccessFn(data, status, headers, config) {
                    setAuthenticateAccount(data.data);
                    var search = $location.search();
                    var url = search.redirect || '/';
                    // $location.path(unescape(url)).search('redirect', null)
                    // $state.reload();
                    window.location = '/'
                }

                function loginErrorFn(data, status, headers, config) {
                    console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    unauthenticate();

                    window.location = '/';
                }

                function logoutErrorFn(data, status, headers, config) {
                    console.error('Epic failure!');
                }
            }

            function isAuthenticatedAccount() {
                return !!$cookies.get('authencatedAccount');
            }

            function setAuthenticateAccount(account) {
                var now = new $window.Date(),
                    // this will set the expiration to 1 months
                    exp = new $window.Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
                $cookies.put('authencatedAccount', JSON.stringify(account), {
                    expires: exp
                });
            }

            function unauthenticate() {
                $cookies.remove('authencatedAccount');
            }

        }]);

}),define("course/chapter/contorller", ["angular", "ngSanitize", "authentication/service", "course/course/service"], function(angular) {

    return angular
    .module('app.course.chapter.controllers', ['ngSanitize'])
    .controller('ChapterController', ['Authentication' , 'Course', '$stateParams',
        function(Authentication, Course, $stateParams){
            var vm = this;
            var course_id = $stateParams.id;
            vm.is_authenticated = Authentication.isAuthenticatedAccount();
            Course.getCourseById(course_id).then(function(data){
                vm.course = data;
            });
        }]);
}),define("course/course/controller", ["angular", "course/course/service"], function(angular) {
    return angular
        .module('app.course.controllers', [])
        .controller('CourseController', ['$location', '$scope', 'Course', function($location, $scope, Course) {
            $scope.page = 1;
            $scope.category = 0;
            $scope.onLoad = !1;
            $scope.$watch('page', function(newV, oldV){
                $scope.onLoad = !1;
                if (newV == oldV || $scope.page == 1){
                    return;
                }else{
                    $scope.getCourse(newV, $scope.category);
                }
            });
            $scope.$watch('category', function(newV, oldV){
                $scope.onLoad = !1;
                if (newV == oldV){
                    return;
                }else{
                    $scope.page = 1;
                    $scope.getCourse($scope.page, newV);
                }
            });
            $scope.getCourse = function(page, category){
                page = page || 1, category = category || 0;
                $scope.onLoad = !0;
                Course.getCourseList(page, category).then(function(data){
                    if (page==1){
                        $scope.course_list = data;
                    }else{
                        $scope.course_list = $scope.course_list.concat(data)
                    }
                    $scope.onLoad = !1;
                }, function(data){
                    $scope.onLoad = !1;
                });
            }
            $scope.getCourse(1, 0);
        }])
}),define("course/view/contorller", ["angular", "ngSanitize", "course/course/service", "course/comment/service"], function(angular) {
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
}),define("course/comment/service", ["angular"], function(angular) {
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

}),define("course/course/service", ["angular"], function(angular) {
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
                getCourseList: function(page, id) {
                    var d = $q.defer();
                    return $http.get('/api/v1/courses/', {
                            params: {
                                page: page,
                                cate_id: id,
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
                }
            };
        }])

}),define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
    return angular
        .module('app.layout.controllers', [])
        .controller('NavbarController', ['$scope', 'Authentication', function($scope, Authentication){
            var vm = this;
            vm.logout = function(){
                Authentication.logout();
            }
        }])
}),define("app", ["angular", "ngAnimate", "uiBootstrapTpls", "layout/app", "authentication/app", "app/routes", "app/course"], function(angular) {
    return angular
        .module('app', [
            'ui.bootstrap',
            'app.routes',
            'ngAnimate',
            'app.authentication',
            'app.course',
            'app.layout'
        ])
        .run(['$http', function($http) {
            $http.defaults.xsrfHeaderName = 'X-CSRFToken'
            $http.defaults.xsrfCookieName = 'csrftoken'
        }]);
}),define("app/routes", ["angular", "uiRouter"], function(angular) {
    angular
        .module('app.routes', ['ui.router'])
        .config(function($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('register', {
                url: "/register",
                controller: 'RegisterController',
                controllerAs: 'vm',
                templateUrl: '/static/templates/authentication/register.html'
            })
            .state('login', {
                url: '/login?redirect',
                controller: 'LoginController',
                controllerAs: 'loginCtrl',
                templateUrl: '/static/templates/authentication/login.html'
            })
            .state('course', {
                url: '/course?id',
                templateUrl: '/static/templates/course/courselist.html',
                controller: 'CourseController',
                controllerAs: 'courseCtrl'
            })
            .state('chapter', {
                url: '/chapter/:id',
                templateUrl: '/static/templates/course/course_chapter.html',
                controller: 'ChapterController as vm'
            })
            .state('view', {
                url: '/view/:id',
                templateUrl: '/static/templates/course/chapter_detail.html',
                controller: 'ViewController as vm'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '/static/templates/account/settings.html'
            })
            .state('settings.avatar', {
                url: '/avatar',
                templateUrl: '/static/templates/account/settings/settings-avatar.html'
            })
            .state('settings.password', {
                url: '/password',
                templateUrl: '/static/templates/account/settings/settings-password.html'
            })
            .state('settings.feedback', {
                url: '/feedback',
                templateUrl: '/static/templates/account/settings/settings-feedback.html'
            })
            .state('account', {
                url: '/account',
                templateUrl: '/static/templates/account/account.html'
            })
            $urlRouterProvider.otherwise("/");
        })
}),requirejs.config({
    paths: {
        underscore: "/static/bower_components/underscore/underscore",
        jquery: "/static/bower_components/jquery/dist/jquery",
        angular: "/static/bower_components/angular/angular",
        uiRouter: "/static/bower_components/angular-ui-router/release/angular-ui-router",
        uiBootstrap: "/static/bower_components/angular-bootstrap/ui-bootstrap.min",
        uiBootstrapTpls: "/static/bower_components/angular-bootstrap/ui-bootstrap-tpls.min",
        cropper: "/static/bower_components/cropper/dist/cropper.min",
        ngAnimate: "/static/bower_components/angular-animate/angular-animate",
        ngAria: "/static/bower_components/angular-aria/angular-aria",
        ngCookies: "/static/bower_components/angular-cookies/angular-cookies",
        ngSanitize: "/static/bower_components/angular-sanitize/angular-sanitize",
        tinyMce: "/static/bower_components/tinymce/tinymce.min",
        app: "/static/javascripts/app",
        tinyMce_lang: "/static/javascripts/util/zh_CN"
    },
    shim: {
        angular: {
            deps: ["jquery"],
            exports: "angular"
        },
        uiBootstrapTpls: ["angular", "uiBootstrap"],
        uiBootstrap: ["angular", "ngAnimate", "ngAria"],
        ngAnimate: ["angular"],
        ngAria: ["angular"],
        ngSanitize: ["angular"],
        uiRouter: ["angular"],
        ngCookies: ["angular"],
        cropper: ["jquery"],
        underscore: {
            exports: "_"
        },
        tinyMce_lang: ['tinyMce']
        // tinyMce: ["tinyMce_lang"]
    }
}), require(["app"], function() {
     angular.element().ready(function() {
        // angular.resumeBootstrap([app['name']]);
        angular.bootstrap(document, ["app"])
    });
    // angular.element(document).ready(function() {
    // })
}), define("main", function() {})