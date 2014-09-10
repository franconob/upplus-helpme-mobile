var controllers;

controllers = angular.module("fitSOS.controllers", []);

controllers.controller("LoginCtrl", ["$rootScope", "$scope", "$state", "SessionService", "socket", function ($rootScope, $scope, $state, SessionService, socket) {
    $scope.loginData = {};

    var users = [
        {id: 1, email: 'fherrero@spiralti.com', password: 'echesortufc'},
        {id: 2, email: 'vherrero@spiralti.com', password: 'claudita123'}
    ];

    return $scope.doLogin = function (loginData) {

        var user = _.find(users, {'email': loginData.username, 'password': loginData.password});
        if (user) {
            SessionService.authenticated = true;
            SessionService.username = loginData.username;
            SessionService.id = loginData.id;
            socket.io.socket.put('/api/chatuser/' + socket.loggedUser.id, {name: SessionService.username}, function (user) {
                $rootScope.usuario.name = user.name;
            });

            $state.transitionTo('proveedores');
        }
    };
}]);

controllers.controller("MainCtrl", function ($scope, $state, socket, $rootScope) {
    $scope.messages = [];
    $scope.message_count = 0;

    $scope.$on('user.session.updated', function (evt, args) {
        $scope.$apply(function () {
            $scope.usuario = args;
        });
    })

    $scope.goToMessages = function () {
        $state.transitionTo("messages");
    }
});

controllers.controller("HomepageCtrl", function ($scope) {
});

controllers.controller("ProveedoresCtrl", [
    "$scope", "socket", function ($scope, socket) {
        $scope.$on('user.added', function (evt, args) {
            $scope.$apply(function () {
                $scope.users.push(args);
            })
        })

        $scope.$on('user.destroyed', function (evt, id) {
            var index = _.findIndex($scope.users, function (user) {
                return user.id == id
            });

            $scope.$apply(function() {
                $scope.users.splice(index, 1);
            });
        });

        socket.io.socket.get('/api/chatuser', function (users) {
            $scope.$apply(function () {
                $scope.users = users;
            })
        })
    }
]);

controllers.controller("ChatCtrl", ["$scope", "$stateParams", "socket", function ($scope, $stateParams, socket) {
    var userid = $stateParams.id;
    $scope.messages = [];

    $scope.send = function (message) {
        socket.io.socket.post('/api/chat/message/', {to: userid, msg: message});
    }

    socket.io.socket.on('chatuser', function (event) {
        if (event.verb == 'messaged') {
            $scope.messages.push({text: event.data.msg});
        }
    });

}]);

controllers.controller("MessagesCtrl", ["$scope", "socket", function ($scope, socket) {

}]);
