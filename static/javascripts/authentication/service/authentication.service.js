(function() {
    'user strict';

    angular
        .module('app.authentication.services')
        .factory('Authentication', ['$cookies', '$http', function($cookies, $http) {
            return {
                register: register,
                login: login,
                logout: logout,
                isAuthenticatedAccount: isAuthenticatedAccount,
                setAuthenticateAccount: setAuthenticateAccount,
                unauthenticate: unauthenticate
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
                    window.location = '/';
                }

                function loginErrorFn(data, status, headers, config) {
                    console.log('login errrors');
                }
            }

            function logout() {
                return $http.post('/api/v1/auth/logout/')
                    .then(logoutSuccessFn, logoutErrorFn);
            }

            function logoutSuccessFn(data, status, headers, config) {
                unauthenticate();

                window.location = '/';
            }

            function logoutErrorFn(data, status, headers, config) {
                console.error('Epic failure!');
            }

            function isAuthenticatedAccount() {
                return !!$cookies.authencatedAccount;
            }

            function setAuthenticateAccount(account) {
                $cookies.authencatedAccount = JSON.stringify(account);
            }

            function unauthenticate() {
                delete $cookies.authencatedAccount;
            }



        }]);

})();