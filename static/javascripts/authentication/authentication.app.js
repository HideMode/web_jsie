define("authentication/app", ["angular", "authentication/controller/login", "authentication/controller/register", "authentication/service"], function(angular) {
    return angular
        .module('app.authentication', [
            'app.authentication.controller.login',
            'app.authentication.controller.register',
            'app.authentication.services'
        ]);
})