define("app/account", ["angular", "account/controller/avatar", "account/controller/password", "account/controller/account"], function(angular) {
    return angular
        .module('app.account', [
            "app.account.controller.avatar",
            "app.account.controller.password",
            "app.account.controller.account",
        ]);
}),define("account/cropper/directive", ["angular", "underscore"], function(angular, _) {
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
            'app.authentication.controller.login',
            'app.authentication.controller.register',
            'app.authentication.services'
        ]);
}),define("app/course", ["angular", "course/directives", "course/comment/service", "course/course/service", "course/chapter/contorller", "course/course/controller",  "course/view/contorller", "course/search/controller"], function(angular) {
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
}),define("course/directives", ["angular", "tinyMce", "ngCookies", "course/course/service", "authentication/service", "course/comment/service", "components/snackbar/service"], function(angular) {
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
        .directive("tinyMce", ["$compile", "$state", "$location", "Authentication", "Snackbar",
            function($compile, $state, $location, Authentication, Snackbar) {
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
                            Snackbar.show("评论成功!")
                        }
                    },
                    controllerAs: 'vm',
                };
            }
        ])
        .directive('showReply', ["$compile", 'Course', 'Authentication', 'Comment', "Snackbar",
            function($compile, Course, Authentication, Comment, Snackbar) {
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
                                    Snackbar.show("评论成功!")
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
        .directive('replyList', ["$compile", '$timeout', 'Comment', 'Authentication', "Snackbar",
            function($compile, $timeout, Comment, Authentication, Snackbar) {
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
                                    Snackbar.show("评论成功!")
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
                                    Snackbar.show("评论成功!")
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
}),define("components/cropper/directive", ["angular", "underscore", "cropper", "components/snackbar/service", "authentication/service"], function(angular, _) {
    return angular
        .module('app.component.cropper', [])
        .directive("croperPhoto", ["$compile", "$parse", "$timeout", "Snackbar", 'Authentication',
            function($compile, $parse, $timeout, Snackbar, Authentication) {
                return {
                    restrict: "EA",
                    templateUrl: "/static/templates/components/cropper.html",
                    scope: {
                        imageUrl: "@",
                    },
                    link: function($scope, iElement) {
                        var $image = iElement.find("#_cropper-container > img"),
                            $inputImage = iElement.find("#fileInput");
                        $image.attr("src", $scope.imageUrl), $image.cropper({
                            aspectRatio: 1,
                            preview: ".account-head-pic",
                            checkImageOrigin: !1,
                            crop: function(data) {
                                // $scope.$root.$$phase || $scope.$apply(function() {
                                //     $scope.jsonImageData = {
                                //         url: $scope.imageUrl,
                                //         x: Math.round(data.x),
                                //         y: Math.round(data.y),
                                //         width: Math.round(data.width),
                                //         height: Math.round(data.height)
                                //     }
                                // })
                            },
                            built: function() {}
                        }), $inputImage.change(function() {
                            var file = this.files[0];
                            return "image/bmp" != file.type && "image/jpg" != file.type && 
                            "image/jpeg" != file.type && "image/png" != file.type ? 
                            void Snackbar.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！") : 
                            file.size > 1048576 ? void Snackbar.error("图片文件大小超过1M!") : 
                            (Authentication.uploadImage(file).then(function(res) {
                                result = res.data
                                if (result){
                                    $scope.imageUrl = result.avatar;
                                    Snackbar.show('头像上传成功，请刷新页面!');
                                }else{
                                    Snackbar.error('错误:'+res.errors);
                                }
                            }, 
                            function() {
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
}),define("components/module", ["angular", "components/cropper/directive", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.components', [
            "app.component.cropper",
            "app.services.snackbar"
        ]);
}),define("components/snackbar/service", ["angular", "jquery", "underscore", "snackbar"], function(angular, $, _) {

  return angular
    .module('app.services.snackbar', [])
    .factory('Snackbar', Snackbar);

  /**
   * @namespace Snackbar
   */
  function Snackbar() {
    /**
     * @name Snackbar
     * @desc The factory to be returned
     */
    var Snackbar = {
      error: error,
      show: show
    };

    return Snackbar;

    ////////////////////

    /**
     * @name _snackbar
     * @desc Display a snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function _snackbar(content, options) {
      options = _.extend({
        timeout: 3000,
        htmlAllowed: true
      }, options);
      options.content = content;
      $.snackbar(options);
    }


    /**
     * @name error
     * @desc Display an error snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function error(content, options) {
      _snackbar('错误: ' + content, options);
    }


    /**
     * @name show
     * @desc Display a standard snackbar
     * @param {string} content The content of the snackbar
     * @param {Object} options Options for displaying the snackbar
     */
    function show(content, options) {
      _snackbar(content, options);
    }
  }
}),define("account/controller/account", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.account', [])
        .controller('AccountController', function($scope, Authentication){
            $scope.user = Authentication.getCurrentUser()
        })
}),define("account/controller/avatar", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.avatar', [])
        .controller('AvatarController', function($scope, Authentication){
            $scope.user = Authentication.getCurrentUser()
        })
}),define("account/controller/password", ["angular", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.account.controller.password', [])
        .controller('PassWordController', function($scope, Authentication, Snackbar){
            $scope.is_correct = !1;
            $scope.is_ok = !1;
            $scope.user = {
                oldPwd: '',
                newPwd: '',
                cfmPwd: ''
            }

            $scope.checkPassword = function(){
                Authentication.checkUserPassword($scope.user.oldPwd).then(function(data){
                    if(data.success){
                        Snackbar.show('密码输入正确!')
                        $scope.is_correct = !0;
                    }
                    else{
                        Snackbar.show('错误:请输入正确的密码!')
                        $scope.is_correct = !1;
                    }
                });
            }

            $scope.changePassword = function(){
                Authentication.changePassword($scope.user.newPwd, $scope.user.cfmPwd)
            }

            $scope.$watch('user.newPwd+user.cfmPwd', function(nv, ov){
                if ($scope.user.newPwd && $scope.user.cfmPwd  && $scope.user.newPwd == $scope.user.cfmPwd){
                    $scope.is_ok = !0;
                }else{
                    $scope.is_ok = !1;
                    if ($scope.user.newPwd && $scope.user.cfmPwd){

                        Snackbar.error('错误:输入的两次密码不相同!')
                    }else{

                    }
                }
            })
            // $scope.$watch('user.oldPwd', function(nv, ov) {
            //      // body...  
            //      console.log(nv, ov)
            // })

        })
}),define("authentication/controller/login", ["angular", "ngCookies", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.authentication.controller.login', [])
        .controller('LoginController', ['$location', '$scope', 'Authentication', "Snackbar", function($location, $scope, Authentication, Snackbar) {
            var vm = this;
            activate();
            vm.login = function() {
                Authentication.login(vm.email, vm.password);
            }

            function activate() {
                if (Authentication.isAuthenticatedAccount()) {
                    $location.url('/');
                    Snackbar.show("登陆成功!");
                }
            }
        }])
}),define("authentication/controller/register", ["angular", "ngCookies", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication.controller.register', [])
        .controller('RegisterController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
            var vm = this;
            vm.register = function() {
                Authentication.register(vm.email, vm.password, vm.username);
            }
        }]);
}),define("authentication/service", ["angular", "ngCookies", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$q', '$location', '$state', '$window', 'Snackbar', '$timeout', function($cookies, $http, $q, $location, $state, $window, Snackbar, $timeout) {
            var currentUser;
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
                uploadImage: uploadImage,
                checkUserPassword: checkUserPassword,
                changePassword: changePassword
            }

            function setCurrentUser(user) {
                currentUser = user;
            }

            function getCurrentUser() {
                return currentUser;
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
                    // setAuthenticateAccount(data.data);
                    Snackbar.show('登陆成功!');
                    $timeout(function() {
                        var search = $location.search();
                        var url = search.redirect || '/';
                        $state.go('account')
                    }, 1000);
                }

                function loginErrorFn(data, status, headers, config) {
                    Snackbar.error('错误:' + data.data);
                    // console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    // unauthenticate();
                    $state.go('login')
                    // window.location = '/';
                }

                function logoutErrorFn(data, status, headers, config) {
                    console.error('logout failure!');
                }
            }

            function isAuthenticatedAccount() {
                // return !!$cookies.get('authencatedAccount');
                return !!currentUser;
            }

            function setAuthenticateAccount(account) {
                var now = new $window.Date(),
                    exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
                $cookies.put('authencatedAccount', JSON.stringify(account), {
                    expires: exp
                });
            }

            function uploadImage(model) {
                var fd = new FormData;
                fd.append("avatar", model);
                var promise = $http.post("/account/uploadimage/", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": void 0
                    }
                });
                return promise;
            }

            function changePassword(password, confirm_password) {
                return $http.put("/api/v1/accounts/" + currentUser.id + '/', {
                    password: password,
                    confirm_password: confirm_password
                }).then(function(data, status) {
                    Snackbar.show('密码更新成功，请重新登陆！')
                    $timeout(function() {
                        logout();
                    }, 3000);
                }, function() {
                    Snackbar.show('错误:更新失败!')
                });

            }

            function checkUserPassword(password) {
                var d = $q.defer();
                return $http.post("/account/checkpassword/", {
                    password: password
                }).success(function(data) {
                    d.resolve(data)
                }).error(function(err) {
                    d.reject(err);
                }), d.promise;
            }
            // function unauthenticate() {
            //     if (isAuthenticatedAccount()){
            //         $cookies.remove('authencatedAccount');
            //     }
            // }

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
}),define("course/search/controller", ["angular", "ngSanitize", "course/course/service"], function(angular) {
    return angular
        .module('app.course.search.controllers', ['ngSanitize'])
        .controller('SearchController', ['$location', '$scope', 'Course', function($location, $scope, Course) {
            var search = $location.search();
            var key_words = search.search || '';
            console.log(search)
            Course.getCourseList(1, 0, key_words).then(function(data){
                $scope.course_list = data;
            })
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
                getCourseList: function(page, id, search) {
                    var d = $q.defer();
                    return $http.get('/api/v1/courses/', {
                            params: {
                                page: page,
                                cate_id: id,
                                search: search || ''
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
        .controller('NavbarController', ['$scope', '$state', 'Authentication', function($scope, $state, Authentication){
            var vm = this;
            vm.user = Authentication.getCurrentUser();
            vm.is_authenticate = Authentication.isAuthenticatedAccount()
            vm.logout = function(){
                Authentication.logout();
            }
            // words
            vm.searchCourse = function(){
                $state.go('search', {search: vm.words});
                vm.words = '';
            }
        }])
}),define("app", ["angular", "ngAnimate", "uiBootstrapTpls", "layout/app", "authentication/app", "app/account", "app/routes", "app/course", "components/module"], function(angular) {
    return angular
        .module('app', [
            'ui.bootstrap',
            'app.routes',
            'ngAnimate',
            'app.authentication',
            'app.course',
            'app.layout',
            'app.components',
            'app.account'
        ])
        // .run(['$http', 'Authentication', function($http, Authentication) {
        //     $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //     $http.defaults.xsrfCookieName = 'csrftoken';
            // $http.get('/account/currentuser/').then(
            //         function(data, status) {
            //             console.log(data.data)
            //             Authentication.setCurrentUser(data.data);
            //         },
            //         function(data, status){
            //             Authentication.setCurrentUser(null);
            //         }
            //     )
        // }]);
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
                templateUrl: '/static/templates/account/settings/settings-avatar.html',
                controller: 'AvatarController'
            })
            .state('settings.password', {
                url: '/password',
                templateUrl: '/static/templates/account/settings/settings-password.html',
                controller: 'PassWordController'
            })
            .state('settings.feedback', {
                url: '/feedback',
                templateUrl: '/static/templates/account/settings/settings-feedback.html'
            })
            .state('account', {
                url: '/account',
                templateUrl: '/static/templates/account/account.html',
                controller: 'AccountController'
            })
            .state('search', {
                url: '/search?search',
                templateUrl: '/static/templates/course/explore.html',
                controller: 'SearchController'
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
        tinyMce_lang: "/static/javascripts/util/zh_CN",
        snackbar: "/static/bower_components/snackbarjs/dist/snackbar.min"
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
        snackbar: ["jquery"],
        underscore: {
            exports: "_"
        },
        tinyMce_lang: ['tinyMce']
        // tinyMce: ["tinyMce_lang"]
    }
}), require(["app"], function() {

     angular.element().ready(function() {
        // $.get("/account/currentuser/", function(result, status) {
        //     console.log(result)
        //     console.log(status)
        //     var currentUser = result;
        //     var temp = angular.module("app");
        //     temp.run(["Authentication", "$http",
        //         function(Authentication, $http) {
        //             $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        //             $http.defaults.xsrfCookieName = 'csrftoken';
        //             Authentication.setCurrentUser(currentUser);
        //     }]), angular.bootstrap(document, ["app"])
        // })
        $.get("/account/currentuser/")
            .success(function(result, status) {
                var currentUser = result;
                var temp = angular.module("app");
                temp.run(["Authentication", "$http",
                    function(Authentication, $http) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        Authentication.setCurrentUser(currentUser);
                }]), angular.bootstrap(document, ["app"])
            })
            .error(function(result){
                var currentUser = '';
                var temp = angular.module("app");
                temp.run(["Authentication", "$http",
                    function(Authentication, $http) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        Authentication.setCurrentUser(currentUser);
                }]), angular.bootstrap(document, ["app"])
            })
    });
}), define("main", function() {})