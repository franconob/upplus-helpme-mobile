function SocketIO(io, $rootScope, SessionService) {
    this.io = io;

    var self = this;
    this.users = [];

    $rootScope.users = [];
    $rootScope.usuario = {};

    this.io.socket.on('connect', function () {
        self.io.socket.on('hello', function (user) {
            SessionService.user = user;
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

                    console.log('debug', message.previous.name, SessionService.user.id);
                    if (message.previous.name == null && SessionService.user.id == message.id) {
                        console.log('llega!!');
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

                case 'messaged':
                {
                    if(message.data.from.id !== SessionService.user.id) {
                        $rootScope.$broadcast('notifications.messages.received');
                    }
                    $rootScope.$broadcast('user.messaged', message);
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
        id: null,
        user: {}
    }
}).provider('socket', function socketProvider() {

    this.setSocket = function (io) {
        this.io = io;
    };

    this.$get = ["$rootScope", "SessionService", function ($rootScope, SessionService) {
        return new SocketIO(io, $rootScope, SessionService);
    }];

});
