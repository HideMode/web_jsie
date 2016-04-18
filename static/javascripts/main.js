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