define("layout/app", ["angular", "layout/navbar/controller"], function(angular) {
    return angular
        .module('app.layout', [
            'app.layout.controllers'
        ]);
})