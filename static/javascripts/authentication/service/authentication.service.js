define("authentication/service", ["angular", "ngCookies", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$q', '$location', '$state', '$window', 'Snackbar', '$timeout', '$rootScope', function($cookies, $http, $q, $location, $state, $window, Snackbar, $timeout, $rootScope) {
            var currentUser;
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
                uploadImage: uploadImage,
                checkUserPassword: checkUserPassword,
                changePassword: changePassword,
                getUserFollowCourse: getUserFollowCourse
            }

            function setCurrentUser(user) {
                currentUser = user;
            }

            function getCurrentUser() {
                return currentUser;
            }
            function getUserFollowCourse() {
                var d = $q.defer();
                    return $http.get('/account/follow/course/')
                        .success(function(data) {
                            d.resolve(data);
                        })
                        .error(function(err) {
                            d.reject(err);
                        }), d.promise;
            }

            function register(email, password, username) {
                if (!email || !password || !username){
                    return Snackbar.show('邮箱、用户名、密码无法为空!')
                }
                return $http.post('/api/v1/accounts/', {
                    username: username,
                    password: password,
                    email: email
                }).then(registerSuccessFn, registerErrorFn);

                function registerSuccessFn(data, status, headers, config) {
                    login(email, password);
                }

                function registerErrorFn(data, status, headers, config) {
                    console.log('register failed');
                    Snackbar.show(data.data.message)
                }
            }

            function login(email, password) {
                return $http.post('/api/v1/auth/login/', {
                    email: email,
                    password: password
                }).then(loginSuccessFn, loginErrorFn);

                function loginSuccessFn(data, status, headers, config) {
                    // setAuthenticateAccount(data.data);
                    Snackbar.show('登陆成功!');
                    $timeout(function() {
                        var search = $location.search();
                        var url = search.redirect || '/';
                        $rootScope.$apply(function(){
                            $rootScope.currentUser =  data.data;
                        });
                        $state.go('account', {}, { reload: true })
                        // window.location = '/#/account';
                    }, 1000);
                }

                function loginErrorFn(data, status, headers, config) {
                    Snackbar.error('错误:' + data.data);
                    // console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    // unauthenticate();
                    $rootScope.currentUser = null;
                    // $rootScope.$apply();
                    $state.go('login', {}, { reload: true })
                    // window.location = '/#/login';
                }

                function logoutErrorFn(data, status, headers, config) {
                    console.error('logout failure!');
                }
            }

            function isAuthenticatedAccount() {
                // return !!$cookies.get('authencatedAccount');
                return !!currentUser;
            }

            function setAuthenticateAccount(account) {
                var now = new $window.Date(),
                    exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
                $cookies.put('authencatedAccount', JSON.stringify(account), {
                    expires: exp
                });
            }

            function uploadImage(model) {
                var fd = new FormData;
                fd.append("avatar", model);
                var promise = $http.post("/account/uploadimage/", fd, {
                    transformRequest: angular.identity,
                    headers: {
                        "Content-Type": void 0
                    }
                });
                return promise;
            }

            function changePassword(password, confirm_password) {
                return $http.put("/api/v1/accounts/" + currentUser.id + '/', {
                    password: password,
                    confirm_password: confirm_password
                }).then(function(data, status) {
                    Snackbar.show('密码更新成功，请重新登陆！')
                    $timeout(function() {
                        logout();
                    }, 3000);
                }, function() {
                    Snackbar.show('错误:更新失败!')
                });

            }

            function checkUserPassword(password) {
                var d = $q.defer();
                return $http.post("/account/checkpassword/", {
                    password: password
                }).success(function(data) {
                    d.resolve(data)
                }).error(function(err) {
                    d.reject(err);
                }), d.promise;
            }
            // function unauthenticate() {
            //     if (isAuthenticatedAccount()){
            //         $cookies.remove('authencatedAccount');
            //     }
            // }

        }]);

})