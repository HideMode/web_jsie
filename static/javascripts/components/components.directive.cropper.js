define("components/cropper/directive", ["angular", "underscore", "cropper", "components/snackbar/service", "authentication/service"], function(angular, _) {
    return angular
        .module('app.component.cropper', [])
        .directive("croperPhoto", ["$compile", "$parse", "$timeout", "Snackbar", 'Authentication',
            function($compile, $parse, $timeout, Snackbar, Authentication) {
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
                                // $scope.$root.$$phase || $scope.$apply(function() {
                                //     $scope.jsonImageData = {
                                //         url: $scope.imageUrl,
                                //         x: Math.round(data.x),
                                //         y: Math.round(data.y),
                                //         width: Math.round(data.width),
                                //         height: Math.round(data.height)
                                //     }
                                // })
                            },
                            built: function() {}
                        }), $inputImage.change(function() {
                            var file = this.files[0];
                            return "image/bmp" != file.type && "image/jpg" != file.type && 
                            "image/jpeg" != file.type && "image/png" != file.type ? 
                            void Snackbar.error("图片文件格式不支持，请选择bmp、jpeg、jpg、png格式！") : 
                            file.size > 1048576 ? void Snackbar.error("图片文件大小超过1M!") : 
                            (Authentication.uploadImage(file).then(function(res) {
                                result = res.data
                                if (result){
                                    $scope.imageUrl = result.avatar;
                                    Snackbar.show('头像上传成功，请刷新页面!');
                                }else{
                                    Snackbar.error('错误:'+res.errors);
                                }
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