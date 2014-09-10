function SocketIO(io, $rootScope) {
    this.io = io;

    var self = this;
    this.users = [];
    this.loggedUser = {};

    $rootScope.users = [];
    $rootScope.usuario = {};

    this.io.socket.on('connect', function () {
        console.log('conectado!');

        self.io.socket.on('hello', function (user) {
            self.loggedUser = user;
        });

        self.io.socket.on('chatuser', function (message) {
            switch (message.verb) {
                case 'updated':
                {
                    _.each($rootScope.users, function (user) {
                        if (user.id == message.id) {
                            $rootScope.$apply(function () {
                                user.name = message.data.name;
                            });
                        }
                    });
                    if (message.previous.name == null && self.loggedUser.id == message.id) {
                        $rootScope.$broadcast('user.session.updated', message.data);
                    }
                    break;
                }
                case 'created':
                {
                    $rootScope.users.push(message.data);
                    $rootScope.$broadcast('user.added', message.data);
                    break;
                }

                case 'destroyed':
                {
                    $rootScope.$broadcast('user.destroyed', message.id);
                    break;
                }

            }
        });
    });
}

(angular.module("fitSOS.services", [])).factory("Users", [
    "Restangular", function (Restangular) {
        return Restangular.service('user');
    }
]).factory("SessionService", function () {
    return {
        authenticated: false,
        username: null,
        id: null
    }
}).provider('socket', function socketProvider() {

    this.setSocket = function (io) {
        this.io = io;
    };

    this.$get = ["$rootScope", function ($rootScope) {
        return new SocketIO(io, $rootScope);
    }];

});
