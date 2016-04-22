define("account/controller/avatar", ["angular", "components/cropper/directive", "authentication/service"], function() {

    return angular
        .module('app.account.controller.avatar', [])
        .controller('AvatarController', function($scope, Authentication){
            $scope.user = Authentication.getCurrentUser()
        })
})