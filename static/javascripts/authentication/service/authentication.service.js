define("authentication/service", ["angular", "ngCookies"], function(angular) {
    return angular
        .module('app.authentication.services', ['ngCookies'])
        .factory('Authentication', ['$cookies', '$http', '$location', '$state', '$window', function($cookies, $http, $location, $state, $window) {
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                getCurrentUser: getCurrentUser
            }

            function getCurrentUser() {
                return $http.get('/account/currentuser/').then(
                    function(data, status) {
                        unauthenticate()
                        setAuthenticateAccount(data)
                    },
                    function(data, status){
                        unauthenticate()
                    }
                )
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
                    setAuthenticateAccount(data.data);
                    var search = $location.search();
                    var url = search.redirect || '/';
                    window.location = '/'
                }

                function loginErrorFn(data, status, headers, config) {
                    console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);

                function logoutSuccessFn(data, status, headers, config) {
                    unauthenticate();

                    window.location = '/';
                }

                function logoutErrorFn(data, status, headers, config) {
                    console.error('Epic failure!');
                }
            }

            function isAuthenticatedAccount() {
                return !!$cookies.get('authencatedAccount');
            }

            function setAuthenticateAccount(account) {
                var now = new $window.Date(),
                    exp = new $window.Date(now.getFullYear(), now.getMonth(), now.getDate()+7);
                $cookies.put('authencatedAccount', JSON.stringify(account), {
                    expires: exp
                });
            }

            function unauthenticate() {
                if (isAuthenticatedAccount()){
                    $cookies.remove('authencatedAccount');
                }
            }

        }]);

})