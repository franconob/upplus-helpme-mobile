function SocketIO(socket, $rootScope, SessionService) {
    this.socket = socket;

    var self = this;
    this.users = [];

    $rootScope.users = [];
    $rootScope.usuario = {};

    this.socket.on('connect', function () {
          self.socket.on('sessionuser', function (message) {
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

                    if (message.previous.name == null && SessionService.user.id == message.id) {
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
                    if (message.data.from.id !== SessionService.user.id) {
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

    this.setSocket = function (sock) {
        this.io = sock;
    };

    this.$get = ["$rootScope", "SessionService", function ($rootScope, SessionService) {
        return new SocketIO(this.io, $rootScope, SessionService);
    }];

}).factory('TokenInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        response: function (response) {
            return response || $q.when(response);
        }
    };
});
