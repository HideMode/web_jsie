define("app/account", ["angular", "account/controller/avatar"], function(angular) {
    return angular
        .module('app.account', [
            "app.account.controller.avatar"
        ]);
})