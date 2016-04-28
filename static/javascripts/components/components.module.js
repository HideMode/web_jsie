define("components/module", ["angular", "components/cropper/directive", "components/snackbar/service", "components/navbar/directive"], function(angular) {
    return angular
        .module('app.components', [
            "app.component.cropper",
            "app.services.snackbar",
            "app.component.navbar"
        ]);
})