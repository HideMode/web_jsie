define("account/controller/account", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.account', [])
        .controller('AccountController', function($scope, Authentication){
            $scope.user = Authentication.getCurrentUser()
        })
})