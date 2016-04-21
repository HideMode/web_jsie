define("components/module", ["angular", "components/cropper/directive", "components/snackbar/service"], function(angular) {
    return angular
        .module('app.components', [
            "app.component.cropper",
            "app.services.snackbar"
        ]);
})