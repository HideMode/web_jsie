(function(){
    'use strict';
    angular
        .module('account.directive', [])
        .directive("croperPhoto", ["$compile", "employeeNetService", "$parse", "$timeout", "gintDialog", 
        function($compile, employeeNetService, $parse, $timeout, gintDialog) {
        return {
            restrict: "EA",
            templateUrl: "components/cropper/template.html",
            scope: {
                imageUrl: "=",
                jsonImageData: "="
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
                    return "image/bmp" != file.type && "image/jpg" != file.type && "image/jpeg" != file.type && "image/png" != file.type ? void gintDialog.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！", 1) : file.size > 4194304 ? void gintDialog.error("图片文件大小超过4M!", 1) : (employeeNetService.uploadImage(file).then(function(result) {
                        result = result.data, result.status ? $scope.imageUrl = result.data.url : gintDialog.error(result.message, 1)
                    }, function() {
                        gintDialog.error("网络异常，上传失败", 1)
                    }), void $inputImage.val(""))
                }), $scope.changeImage = function(e) {
                    e.stopPropagation(), e.preventDefault(), $inputImage.click()
                }, $scope.$watch("imageUrl", function(nv, ov) {
                    nv !== ov && $image.cropper("replace", nv)
                })
            }
        }
    }])
})();