requirejs.config({
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
                temp.run(["Authentication", "$http", "$rootScope",
                    function(Authentication, $http, $rootScope) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        $rootScope.currentUser = currentUser;
                        Authentication.setCurrentUser(currentUser);
                }]), angular.bootstrap(document, ["app"])
            })
            .error(function(result){
                var currentUser = '';
                var temp = angular.module("app");
                temp.run(["Authentication", "$http", "$rootScope",
                    function(Authentication, $http, $rootScope) {
                        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
                        $http.defaults.xsrfCookieName = 'csrftoken';
                        $rootScope.currentUser = currentUser;
                        Authentication.setCurrentUser(currentUser);
                }]), angular.bootstrap(document, ["app"])
            })
    });
}), define("main", function() {})