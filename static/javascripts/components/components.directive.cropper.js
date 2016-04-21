define("components/cropper/directive", ["angular", "underscore", "cropper", "components/snackbar/service"], function(angular, _) {
    return angular
        .module('app.component.cropper', [])
        .directive("croperPhoto", ["$compile", "$parse", "$timeout", "Snackbar",
            function($compile, $parse, $timeout, Snackbar) {
                return {
                    restrict: "EA",
                    templateUrl: "/static/templates/components/cropper.html",
                    scope: {
                        imageUrl: "@",
                    },
                    link: function($scope, iElement) {
                        var $image = iElement.find("#_cropper-container > img"),
                            $inputImage = iElement.find("#fileInput");
                        $image.attr("src", $scope.imageUrl), $image.cropper({
                            aspectRatio: 1,
                            preview: ".account-head-pic",
                            checkImageOrigin: !1,
                            crop: function(data) {
                                $scope.$root.$$phase || $scope.$apply(function() {
                                    $scope.jsonImageData = {
                                        url: $scope.imageUrl,
                                        x: Math.round(data.x),
                                        y: Math.round(data.y),
                                        width: Math.round(data.width),
                                        height: Math.round(data.height)
                                    }
                                })
                            },
                            built: function() {}
                        }), $inputImage.change(function() {
                            var file = this.files[0];
                            return "image/bmp" != file.type && "image/jpg" != file.type && 
                            "image/jpeg" != file.type && "image/png" != file.type ? 
                            void Snackbar.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！") : 
                            file.size > 1048576 ? void Snackbar.error("图片文件大小超过1M!") : 
                            (employeeNetService.uploadImage(file).then(function(result) {
                                result = result.data, result.status ? $scope.imageUrl = result.data.url : Snackbar.error(result.message)
                            }, 
                            function() {
                            }), void $inputImage.val(""))
                        }), $scope.changeImage = function(e) {
                            e.stopPropagation(), e.preventDefault(), $inputImage.click()
                        }, $scope.$watch("imageUrl", function(nv, ov) {
                            nv !== ov && $image.cropper("replace", nv)
                        })
                    }
                }
            }
        ])
})