define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
    return angular
        .module('app.layout.controllers', [])
        .controller('NavbarController', ['$scope', 'Authentication', function($scope, Authentication){
            var vm = this;
            vm.logout = function(){
                Authentication.logout();
            }
        }])
})