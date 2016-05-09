define("authentication/controller/login", ["angular", "ngCookies", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.authentication.controller.login', [])
        .controller('LoginController', ['$location', '$scope', 'Authentication', "Snackbar", function($location, $scope, Authentication, Snackbar) {
            var vm = this;
            vm.login = function() {
                Authentication.login(vm.email, vm.password);
            }

        }])
})