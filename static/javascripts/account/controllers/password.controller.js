define("account/controller/password", ["angular", "authentication/service", "components/snackbar/service"], function() {

    return angular
        .module('app.account.controller.password', [])
        .controller('PassWordController', function($scope, Authentication, Snackbar){
            $scope.is_correct = !1;
            $scope.is_ok = !1;
            $scope.user = {
                oldPwd: '',
                newPwd: '',
                cfmPwd: ''
            }

            $scope.checkPassword = function(){
                Authentication.checkUserPassword($scope.user.oldPwd).then(function(data){
                    if(data.success){
                        Snackbar.show('密码输入正确!')
                        $scope.is_correct = !0;
                    }
                    else{
                        Snackbar.show('错误:请输入正确的密码!')
                        $scope.is_correct = !1;
                    }
                });
            }

            $scope.changePassword = function(){
                Authentication.changePassword($scope.user.newPwd, $scope.user.cfmPwd)
            }

            $scope.$watch('user.newPwd+user.cfmPwd', function(nv, ov){
                if ($scope.user.newPwd && $scope.user.cfmPwd  && $scope.user.newPwd == $scope.user.cfmPwd){
                    $scope.is_ok = !0;
                }else{
                    $scope.is_ok = !1;
                    if ($scope.user.newPwd && $scope.user.cfmPwd){

                        Snackbar.error('错误:输入的两次密码不相同!')
                    }else{

                    }
                }
            })
            // $scope.$watch('user.oldPwd', function(nv, ov) {
            //      // body...  
            //      console.log(nv, ov)
            // })

        })
})