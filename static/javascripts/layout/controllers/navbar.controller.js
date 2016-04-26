define("layout/navbar/controller", ["angular", "authentication/service"], function(angular) {
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
})