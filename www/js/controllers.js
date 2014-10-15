var controllers;

controllers = angular.module("helpme.controllers", []);

controllers.controller("LoginCtrl", ["$scope", "$state", "SessionService", "$ionicPopup", "LoadingService", "$cordovaSms", function ($scope, $state, SessionService, $ionicPopup, LoadingService, $cordovaSms) {
    $scope.loginData = {};
    $scope.showBar = false;

    $scope.sendSms = function () {
        $cordovaSms.send('+543416969784', 'Hola Zurdo, soy el kui', '').then(function (res) {
            alert('Enviado correctamente: ' + res);
        }, function (err) {
            alert('Error enviando: ' + err);
        });
    }

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

controllers.controller("MainCtrl", function ($scope, $state, $cordovaLocalNotification, SessionService, $cordovaBackgroundGeolocation) {
    $scope.messages = [];
    $scope.messageCount = 0;
    $scope.user = {};
    $scope.messages = [];
    $scope.total_users = 0;
    $scope.incommingMessages = [];
    $scope.users = [];
    $scope.useGPS = {
        status: false
    };
    var GPSOptions = {
        notificationTitle: 'GPS Helpme',
        notificationText: 'GPS Activado',
        timeout: 100,
        enableHighAccuracy: true,
        debug: true

    };

    $scope.goToMessages = function () {
        $state.transitionTo("messages");
    };


    $scope.$on('notification.local.click', function (evt, data) {
        if (data.id == 'com.help.upplus4.notification.message') {
            $scope.apply(function () {
                $state.transitionTo('homepage.chat', {id: data.json.from})
            })
        }
    });

    $scope.$on('user.messaged', function (evt, message) {

        $cordovaLocalNotification.add({
            id: 'com.help.upplus4.notification.message',
            title: 'Mensaje recibido',
            message: message.data.from.name + ': ' + message.data.message,
            json: {from: message.data.from.userid}
        }).then(function (arg) {
            console.log(arg);
        });
        $scope.incommingMessages.push(message);
    });

    $scope.goToProfile = function () {
        $state.transitionTo('homepage.profile', {id: SessionService.user.id});
    };

    $scope.$watch('useGPS.status', function (oldVal, newVal) {
        if (newVal) {
            console.log('activado GPS');
        } else {
            //$cordovaBackgroundGeolocation.stop();
        }
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

        socket.emit('get', '/sessionuser/list', {
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

controllers.controller("ChatCtrl", ["$scope", "$rootScope", "$stateParams", "socket", "$cordovaLocalNotification", "$window", "SessionService", "$ionicScrollDelegate", "$ionicModal", function ($scope, $rootScope, $stateParams, socket, $cordovaLocalNotification, $window, SessionService, $ionicScrollDelegate, $ionicModal) {
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

    $scope.send = function (message, type) {
        $scope.message = "";
        socket.socket.post('/sessionuser/message/', {
            to: userid,
            message: message,
            type: type,
            headers: {
                Authorization: $window.sessionStorage.token
            }
        }, function (data) {
            $scope.$apply(function () {
                $scope.messages.push(data);
                $ionicScrollDelegate.$getByHandle('chat').scrollBottom();
            })
        });
    };

    /** mover este codigo a MainController **/
    $scope.$on('user.messaged', function (evt, message) {
        if (message.data.from.userid == userid) {
            $scope.$apply(function () {
                $scope.messages.push(message.data);
                $ionicScrollDelegate.$getByHandle('chat').scrollBottom();
            })

        } else {
            $cordovaLocalNotification.add({
                id: 'com.help.upplus4.notification.message',
                title: 'Mensaje recibido',
                message: message.data.from.name + ': ' + message.data.message,
                json: {to: message.data.from.userid}
            }).then(function (arg) {
                console.log(arg);
            });
        }
    });

    $scope.receivePicture = function (imageData) {
        $scope.send(imageData, 'image');
    };

    $scope.openImage = function (image) {
        $scope.imageTap = image;
        $ionicModal.fromTemplateUrl('templates/proveedores/imageModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;

            $scope.modal.show();
        });

        $scope.closeModal = function () {
            $scope.modal.hide();
        };
    };

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

controllers.controller("ProfileCtrl", ["$scope", "$stateParams", "Restangular", "SessionService", function ($scope, $stateParams, Restangular, SessionService) {
    Restangular.one('user', $stateParams.id).get().then(function (resp) {
        $scope.user = resp.data;
    });

    $scope.getInclude = function () {
        if (parseInt($stateParams.id) !== SessionService.user.id) {
            return "templates/proveedores/profile/_profile_footer.html";
        } else {
            return "templates/proveedores/profile/_profile_footer_mine.html";
        }
    };

    $scope.edit = function () {
        $scope.transitionTo('homepage.perfil.edit');
    }
}]);

controllers.controller("MessagesCtrl", ["$scope", "socket", function ($scope, socket) {

}]);
