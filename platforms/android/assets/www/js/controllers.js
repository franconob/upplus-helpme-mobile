var controllers;

controllers = angular.module("helpme.controllers", []);

controllers.controller("LoginCtrl", ["$scope", "$state", "SessionService", "$ionicPopup", "LoadingService", function ($scope, $state, SessionService, $ionicPopup, LoadingService) {
    $scope.loginData = {};
    $scope.showBar = false;

    return $scope.login = function (credentials) {
        LoadingService.show('Comprobando credenciales...');
        SessionService.login(credentials, function (response) {
            LoadingService.hide();
            if (response.status == 200) {
                $state.transitionTo('homepage.proveedores');
            } else {
                $ionicPopup.alert({
                    title: '<i class="icon ion-alert-circled"></i>  Usuario o contraseña inválida',
                    template: 'Compruebe las credenciales'
                });
            }
        });
    }
}]);

controllers.controller("MainCtrl", function ($scope, $state) {
    $scope.messages = [];
    $scope.messageCount = 0;
    $scope.user = {};
    $scope.messages = [];
    $scope.total_users = 0;
    $scope.incommingMessages = [];
    $scope.users = [];

    $scope.goToMessages = function () {
        $state.transitionTo("messages");
    };


    $scope.$on('user.messaged', function (evt, message) {
        $scope.incommingMessages.push(message);
    });
});

controllers.controller("HomepageCtrl", function ($scope) {
});

controllers.controller("ProveedoresCtrl", [
    "$scope", "socket", "$window", "$ionicActionSheet", "$state", function ($scope, socket, $window, $ionicActionSheet, $state) {
        $scope.$on('user.added', function (evt, args) {
            $scope.$apply(function () {
                $scope.users.push(args);
            })
        });

        $scope.$on('user.destroyed', function (evt, id) {
            var index = _.findIndex($scope.users, function (user) {
                return user.id == id
            });

            $scope.$apply(function () {
                $scope.users.splice(index, 1);
            });
        });

        socket.socket.get('/sessionuser/list', {
            headers: {
                Authorization: $window.sessionStorage.token
            }
        }, function (users) {
            $scope.$apply(function () {
                $scope.users = users;
            })
        });

        $scope.openSheet = function (id) {
            $ionicActionSheet.show({
                buttons: [
                    {text: '<i class="icon ion-person"></i> Ver perfil'},
                    {text: '<i class="icon ion-chatbox"></i> Enviar mensaje'}
                ],
                titleText: "Acciones",
                buttonClicked: function (index) {
                    if (1 == index) {
                        $state.transitionTo('homepage.chat', {id: id});
                    }

                    if (0 == index) {
                        $state.transitionTo('homepage.profile', {id: id});
                    }
                }
            })
        }
    }
]);

controllers.controller("ChatCtrl", ["$scope", "$rootScope", "$stateParams", "socket", "$cordovaLocalNotification", "$window", "SessionService", "$ionicScrollDelegate", function ($scope, $rootScope, $stateParams, socket, $cordovaLocalNotification, $window, SessionService, $ionicScrollDelegate) {
    var userid = $stateParams.id;

    socket.socket.get('/conversations/' + SessionService.user.id + '/' + userid, {
        headers: {
            Authorization: $window.sessionStorage.token
        }
    }, function (data) {
        $scope.$apply(function () {
            $ionicScrollDelegate.$getByHandle('chat').scrollBottom();
            $scope.messages = data;
        })
    });

    socket.socket.get('/sessionuser/' + userid, {
        headers: {
            Authorization: $window.sessionStorage.token
        }
    }, function (user) {
        $scope.user = user;
    });

    $scope.send = function (message) {
        $scope.message = "";
        socket.socket.post('/sessionuser/message/', {
            to: userid,
            message: message,
            headers: {
                Authorization: $window.sessionStorage.token
            }
        }, function (data) {
            $scope.$apply(function () {
                $scope.messages.push(data);
            })
        });
    };

    $scope.$on('user.messaged', function (evt, message) {
        $scope.$apply(function () {
            $scope.messages.push(message.data);

            $cordovaLocalNotification.add({
                id: 'com.help.upplus4.notification.message',
                title: 'Mensaje recibido',
                message: message.data.from.name + ': ' + message.data.msg
            }).then(function (arg) {
                console.log(arg);
            });
        })
    });


}]);

controllers.controller("NotificationsCtrl", ["$scope", "$state", "$ionicPopover", function ($scope, $state, $ionicPopover) {
    $scope.goToChat = function (id) {
        $state.transitionTo("homepage.chat", {id: id});
        $scope.popover.hide();
    };

    $ionicPopover.fromTemplateUrl('popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
}]);

controllers.controller("ProfileCtrl", ["$scope", "$stateParams", "Restangular", function ($scope, $stateParams, Restangular) {
    Restangular.one('user', $stateParams.id).get().then(function (resp) {
        $scope.user = resp.data;
    })
}]);

controllers.controller("MessagesCtrl", ["$scope", "socket", function ($scope, socket) {

}]);
