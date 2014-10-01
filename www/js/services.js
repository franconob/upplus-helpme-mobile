function SocketIO(socket, $rootScope) {
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
                    $rootScope.$broadcast('user.messaged', message);
                    break;
                }
            }
        });
    });
}

angular.module('helpme.services', []).factory("SessionService", function (Restangular, $window, $rootScope, socket) {
    return {
        authenticated: false,
        username: null,
        id: null,
        user: {},
        login: function (credentials, callback) {
            var self = this;
            Restangular.all('user').all('login').post(credentials).then(function (resp) {
                    $window.sessionStorage.token = resp.data.token;
                    self.authenticated = true;
                    self.user = resp.data;
                    var user = {
                        name: self.user.username,
                        userid: self.user.id
                    };
                    var headers = {
                        Authorization: $window.sessionStorage.token
                    };
                    socket.socket.post('/sessionuser/create', {user: user, headers: headers}, function (data) {
                        $rootScope.user = data;
                    });
                return callback(resp);
            }, function(resp) {
                return callback(resp);
            });
        }
    }
}).provider('socket', function socketProvider() {

    this.setSocket = function (sock) {
        this.io = sock;
    };

    this.$get = ["$rootScope", function ($rootScope) {
        return new SocketIO(this.io, $rootScope);
    }];

}).factory('TokenInterceptor', function ($q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },

        response: function (response) {
            return response || $q.when(response);
        }
    };
}).factory('LoadingService', function ($ionicLoading) {
    return {
        show: function (template) {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> ' + template
            });
        },
        hide: function () {
            $ionicLoading.hide();
        }
    }
});
