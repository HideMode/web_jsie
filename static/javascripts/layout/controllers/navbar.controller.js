define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
    return angular
        .module('app.layout.controllers', [])
        .controller('NavbarController', ['$scope', 'Authentication', function($scope, Authentication){
            var vm = this;
            vm.user = Authentication.getCurrentUser();
            vm.is_authenticate = Authentication.isAuthenticatedAccount()
            vm.logout = function(){
                Authentication.logout();
            }
        }])
})