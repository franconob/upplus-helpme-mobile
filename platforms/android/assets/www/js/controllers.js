var controllers;

controllers = angular.module("fitSOS.controllers", []);

controllers.controller("LoginCtrl", ["$scope", "$state", "SessionService", "Restangular", "$window", "socket", "$ionicPopup", function ($scope, $state, SessionService, Restangular, $window, socket, $ionicPopup) {
    $scope.loginData = {};
    $scope.showBar = false;

    return $scope.login = function (loginData) {
        Restangular.all("user").all("login").post(loginData).then(function (resp) {
            console.log(resp.status);
            if (resp.status == 200) {
                $window.sessionStorage.token = resp.data.token;
                SessionService.authenticated = true;
                SessionService.username = loginData.username;
                SessionService.id = resp.data.id;
                var user = {
                    name: SessionService.username,
                    userid: SessionService.id
                };
                var headers = {
                    Authorization: $window.sessionStorage.token
                };
                socket.socket.post('/sessionuser/create', {user: user, headers: headers}, function (data) {
                    $scope.user = data;
                });
                $state.transitionTo('homepage.proveedores');
            }
        }, function (response) {
            if (response.status == 401) {
                $ionicPopup.alert({
                    title: '<i class="icon ion-alert-circled"></i>  Usuario o contraseña inválida',
                    template: 'Compruebe las credenciales'
                });
            }
        });
    }
}]);

controllers.controller("MainCtrl", function ($scope, $state, socket) {
    $scope.messages = [];
    $scope.message_count = 0;
    $scope.user = {};
    $scope.messages = [];
    $scope.total_users = 0;

    $scope.$on('notifications.messages.received', function () {
        $scope.$apply(function () {
            $scope.message_count++;
        })
    });

    $scope.goToMessages = function () {
        $state.transitionTo("messages");
    }
});

controllers.controller("HomepageCtrl", function ($scope) {
});

controllers.controller("ProveedoresCtrl", [
    "$scope", "socket", "$window", function ($scope, socket, $window) {
        $scope.$on('user.added', function (evt, args) {
            $scope.$apply(function () {
                $scope.users.push(args);
            })
        })

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
        })

    }
]);

controllers.controller("ChatCtrl", ["$scope", "$rootScope", "$stateParams", "socket", "$cordovaLocalNotification", "$window", function ($scope, $rootScope, $stateParams, socket, $cordovaLocalNotification, $window) {
    var userid = $stateParams.id;

    $scope.send = function (message) {
        socket.socket.post('/sessionuser/message/', {
            to: userid,
            msg: message,
            headers: {
                Authorization: $window.sessionStorage.token
            }
        });
        $scope.messages.push({msg: message, time: new Date().toLocaleString()});
    };

    $scope.$on('user.messaged', function (evt, message) {
        $scope.$apply(function () {
            message.data.time = new Date().toLocaleString();
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

controllers.controller("MessagesCtrl", ["$scope", "socket", function ($scope, socket) {

}]);
