function SocketIO(io, $rootScope, SessionService) {
    this.io = io;
    this.socket = null;

    this.users = [];

    this.emit = function (method, path, payload, cb) {
        var self = this;
        // `cb` is optional
        if (typeof cb === 'undefined') {
            cb = null;
        }

        // `data` is optional
        if (typeof payload === 'function') {
            cb = payload;
            payload = {};
        }
        if (this.socket == null) {
            this.socket = this.io.connect(ENDPOINT, {
                query: 'token=' + SessionService.token
            });
            this.socket.on('connect', function () {
                self.bindEvents();
                self.socket[method](path, payload, function (response) {
                    return cb && cb(response);
                });
            })
        } else {
            this.socket[method](path, payload, function (response) {
                return cb && cb(response);
            });
        }


    };

    this.bindEvents = function () {
        var self = this;
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
                    self.users.push(message.data);
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

        self.socket.on('gps', function (message) {
            switch (message.verb) {
                case 'created':
                {
                    $rootScope.$broadcast('gps.received', message);
                    break;
                }
                case 'updated':
                {
                    $rootScope.$broadcast('gps.received', message);
                    break;
                }
            }
        })

    }
}

angular.module('helpme.services', []).factory("SessionService", function (Restangular, $window, $rootScope) {
    return {
        authenticated: false,
        username: null,
        id: null,
        user: {},
        token: null,
        login: function (credentials, callback) {
            var self = this;
            Restangular.all('user').all('login').post(credentials).then(function (resp) {
                $window.sessionStorage.token = self.token = resp.data.token;
                self.authenticated = true;
                self.user = resp.data;
                /*
                 var user = {
                 name: self.user.username,
                 userid: self.user.id
                 };
                 var headers = {
                 Authorization: $window.sessionStorage.token
                 };
                 socket.emit('post', '/sessionuser/create', {user: user, headers: headers}, function (data) {
                 $rootScope.user = data;
                 });
                 **/
                return callback(resp);
            }, function (resp) {
                return callback(resp);
            });
        }
    }
}).provider('socket', function socketProvider() {

    this.setIo = function (io) {
        this.io = io;
    };

    this.$get = ["$rootScope", 'SessionService', function ($rootScope, SessionService) {
        return new SocketIO(this.io, $rootScope, SessionService);
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
