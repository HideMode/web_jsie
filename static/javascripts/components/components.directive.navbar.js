define("components/navbar/directive", ["angular", "underscore", "cropper", "components/snackbar/service", "authentication/service"], function(angular, _) {
    return angular
        .module('app.component.navbar', [])
        .directive("navBar", ["$compile", "$parse", "$timeout", "Snackbar", 'Authentication',
            function($compile, $parse, $timeout, Snackbar, Authentication) {
                return {
                    restrict: "EA",
                    templateUrl: "/static/templates/components/navbar.html",
                    controller: 'NavbarController',
                    controllerAs: 'vm'
                }
            }
        ])
})