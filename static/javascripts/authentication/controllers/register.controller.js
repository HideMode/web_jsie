define("authentication/controller/register", ["angular", "ngCookies", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication.controller.register', [])
        .controller('RegisterController', ['$location', '$scope', 'Authentication', function($location, $scope, Authentication) {
            var vm = this;
            vm.register = function() {
                Authentication.register(vm.email, vm.password, vm.username);
            }
        }]);
})