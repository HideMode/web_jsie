define("authentication/controller/login", ["angular", "ngCookies", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.authentication.controller.login', [])
        .controller('LoginController', ['$location', '$scope', 'Authentication', "Snackbar", function($location, $scope, Authentication, Snackbar) {
            var vm = this;
            activate();
            vm.login = function() {
                Authentication.login(vm.email, vm.password);

                Snackbar.show("登陆成功!");
            }

            function activate() {
                if (Authentication.isAuthenticatedAccount()) {
                    $location.url('/');
                    Snackbar.show("登陆成功!");
                }
            }
        }])
})