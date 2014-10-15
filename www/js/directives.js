/**
 * Created by fherrero on 22/09/14.
 */
angular.module('helpme.directives', [])
    .directive('helpmeNotifications', ["$ionicPopover", "$state", function ($ionicPopover, $state) {
        return {
            restrict: 'E',
            scope: {
                messages: '='
            },
            replace: true,
            template: '<button class="button button-clear button-stable" ng-click="open($event)"><i ng-class="{\'icon ion-chatbubbles\': hasMessages(), \'icon ion-chatbubble\': !hasMessages()}">{{ count }}</i></button>',
            link: function (scope) {

                scope.count = 0;

                scope.hasMessages = function () {
                    return scope.count > 0;
                };

                scope.$on('user.messaged', function () {
                    console.log(scope.messages);
                    scope.$apply(function () {
                        scope.count++;
                    })
                });

                $ionicPopover.fromTemplateUrl('popover.html', {
                    scope: scope
                }).then(function (popover) {
                    scope.popover = popover;
                });

                scope.open = function ($event) {
                    scope.popover.show($event);
                };

                scope.goToChat = function (message) {
                    _.remove(scope.messages, function (msg) {
                        return msg.data.id == message.data.id;
                    });
                    scope.popover.hide();
                    $state.transitionTo('homepage.chat', {id: message.data.from.userid});
                }
            }
        }
    }]).directive('helpmeShare', ["$ionicPopover", "$cordovaCamera", function ($ionicPopover, $cordovaCamera) {
        return {
            restrict: 'A',
            scope: {
                sendPicture: '&'
            },
            template: '<button class="button button-icon icon ion-share" ng-click="openPopover($event)"></button>',
            replace: true,
            link: function linkShare(scope, attrs, elm) {

                var cameraOptions = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: false,
                    encodingType: Camera.EncodingType.JPEG,
                    //targetWidth: 100,
                    //targetHeight: 100,
                    //popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };

                $ionicPopover.fromTemplateUrl('templates/proveedores/shareMenu.html', {
                    scope: scope
                }).then(function (popover) {
                    scope.popover = popover;
                });

                scope.openPopover = function ($event) {
                    scope.popover.show($event);
                };

                scope.openCamera = function () {

                    $cordovaCamera.getPicture(cameraOptions).then(function (imageData) {
                        scope.popover.hide();
                        scope.sendPicture({imageData: imageData});
                    });
                }
            }
        }
    }]);