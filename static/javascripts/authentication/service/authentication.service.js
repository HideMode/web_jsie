define("authentication/service", ["angular", "ngCookies", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$location', '$state', '$window', 'Snackbar', '$timeout', function($cookies, $http, $location, $state, $window, Snackbar, $timeout) {
            var currentUser;
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                getCurrentUser: getCurrentUser,
                setCurrentUser: setCurrentUser,
                uploadImage: uploadImage
            }
            function setCurrentUser(user){
                currentUser = user;
            }
            function getCurrentUser() {
                return currentUser;
            }

            function register(email, password, username) {
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
                    $timeout(function(){
                        var search = $location.search();
                        var url = search.redirect || '/';
                        window.location = '/'
                    }, 1000);
                }

                function loginErrorFn(data, status, headers, config) {
                    Snackbar.error('错误:'+data.data);
                    // console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    // unauthenticate();

                    window.location = '/';
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
                    exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate()+7);
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
                return promise
            }

            function changePassword(){
                
            }
            // function unauthenticate() {
            //     if (isAuthenticatedAccount()){
            //         $cookies.remove('authencatedAccount');
            //     }
            // }

        }]);

})