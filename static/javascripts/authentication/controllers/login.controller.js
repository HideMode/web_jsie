define("authentication/controller/login", ["angular", "ngCookies", "authentication/service"], function() {

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
})