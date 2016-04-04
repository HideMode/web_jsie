(function(){
    'use strict';

    angular
        .module('app.layout.controllers')
        .controller('NavbarController', ['$scope', 'Authentication', function($scope, Authentication){
            var vm = this;
            vm.logout = function(){
                Authentication.logout();
            }
        }])
})();