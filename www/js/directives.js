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
            template: '<button class="button button-clear button-stable" ng-click="open($event)"><i class="icon ion-chatbubbles">{{ count }}</i></button>',
            link: function (scope) {

                scope.count = 0;

                scope.$on('user.messaged', function() {
                    scope.$apply(function() {
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
                        return msg.id == message.id;
                    });
                    scope.popover.hide();
                    $state.transitionTo('homepage.chat', {id: message.data.from.userid});
                }
            }
        }
    }]);