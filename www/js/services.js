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
      console.log(message);
      /** @namespace message.verb */
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
          console.log('usuario creado!');
          self.users.push(message.data);
          $rootScope.$broadcast('user.added', message.data);
          break;
        }

        case 'destroyed':
        {
          if (message.previous && message.previous.socketId == self.socket.socket.sessionid) {
            $rootScope.$broadcast('user.session.close');
          } else {
            var index = _.findIndex(self.users, function (user) {
              return user.id == message.id;
            });
            self.users.splice(index, 1);
            $rootScope.$broadcast('user.destroyed', index);

          }
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

angular.module('helpme.services', []).factory("SessionService", function (Restangular, $window) {
  return {
    authenticated: false,
    id: null,
    user: {},
    token: null,
    login: function (credentials, callback) {
      var self = this;
      Restangular.all('user').all('login').post(credentials).then(function (resp) {
        $window.sessionStorage.token = self.token = resp.data.token;
        self.authenticated = true;
        self.user = resp.data;
        return callback(resp);
      }, function (resp) {
        return callback(resp);
      });
    },

    logout: function logout() {
      delete $window.sessionStorage['token'];
      self.authenticated = false;
      self.user = {};
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
