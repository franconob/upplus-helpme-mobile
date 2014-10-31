var controllers;

controllers = angular.module("helpme.controllers", []);

controllers.controller("LoginCtrl", ["$scope", "$state", "SessionService", "$ionicPopup", "LoadingService", "$cordovaSms", function ($scope, $state, SessionService, $ionicPopup, LoadingService, $cordovaSms) {
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

controllers.controller("MainCtrl", function ($scope, $state, $cordovaLocalNotification, SessionService, $cordovaBackgroundGeolocation, $cordovaGeolocation, $window, socket, $cordovaToast, $ionicPopup) {
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

  $scope.goToMessages = function () {
    $state.transitionTo("messages");
  };


  $scope.$on('notification.local.click', function (evt, data) {
    if (data.id == 'com.help.upplus4.notification.message') {
      $state.transitionTo('homepage.chat', {id: data.json.from})
    }
  });

  $scope.$on('user.messaged', function (evt, message) {

    socket.emit('put', '/conversations/' + message.data.id + '/received');
    $cordovaLocalNotification.add({
      id: 'com.help.upplus4.notification.message',
      title: 'Mensaje recibido',
      message: message.data.from.name + ': ' + (message.data.type == 'text' ? message.data.message : 'Imagen'),
      autoCancel: true,
      json: {from: message.data.from.userid}
    });
    $scope.incommingMessages.push(message);
  });

  $scope.goToProfile = function () {
    $state.transitionTo('homepage.profile', {id: SessionService.user.id});
  };

  $scope.logout = function () {
    SessionService.logout();
    $state.transitionTo('login');
  };


  var options = {
    notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
    notificationText: 'ENABLED', // <-- android only, customize the text of the notification
    debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
    url: ENDPOINT + '/gps', // <-- Android ONLY:  your server url to send locations to
    params: {
      from: SessionService.user.id
    },
    headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
      "authorization": $window.sessionStorage.token
    },
    timeout: 15000,
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    stopOnTerminate: false, // <-- enable this to clear background location settings when the app terminates
    enableHighAccuracy: true
  };

  $scope.$watch('useGPS.status', function (newVal, oldVal) {
    //var bgGeo = window.plugins.backgroundGeoLocation;
    if (newVal) {
      $cordovaGeolocation
        .getCurrentPosition({
          enableHighAccuracy: true,
          maximumAge: 3000,
          timeout: 60000
        })
        .then(function (position) {
          socket.emit('post', '/gps/receive', {
            position: position,
            from: SessionService.user.id
          });
        }, function (err) {
          alert(err);
        });
    } else {
      //bgGeo.stop();
    }
  });

  $scope.$on('gps.received', function (evt, message) {
    console.log(message);
    $cordovaToast.showLongCenter('Usuario ' + message.data.user + 'ubicado en: ' + message.data.latitude + message.data.longitude)
  });

  $scope.$on('user.session.close', function () {
    SessionService.logout();
    $ionicPopup.alert({
      title: 'Nueva sesión',
      template: 'Se ha iniciado sesión en otra ubicación'
    }).then(function () {
      $state.transitionTo('login')
    });
  });

});

controllers.controller("HomepageCtrl", function ($scope) {
});

controllers.controller("ProveedoresCtrl", [
  "$scope", "socket", "$window", "$ionicActionSheet", "$state", "SessionService", function ($scope, socket, $window, $ionicActionSheet, $state, SessionService) {

    socket.emit('get', '/sessionuser/list', function (data) {
      $scope.$apply(function () {
        $scope.users = socket.users = data;
      })
    });

    $scope.$on('user.added', function (evt, args) {
      $scope.$apply(function () {
        $scope.users.push(args);
      })
    });

    $scope.$on('user.logged_in', function (evt, index) {
      $scope.$apply(function () {
      });
    });

    $scope.$on('user.destroyed', function (evt, index) {
      $scope.$apply(function () {
      });
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
    };

    var hasResults = true;

    $scope.needToLoad = function () {
      return socket.users.length >= 10 && hasResults;
    };

    $scope.loadMore = function () {
      socket.emit('get', '/sessionuser/list', {skip: socket.users.length}, function (users) {
        if (users.length == 0) {
          hasResults = false;
        }
        $scope.$apply(function () {
          $scope.users = socket.users = socket.users.concat(users);
          $scope.$broadcast('scroll.infiniteScrollComplete');
        })
      })
    }
  }
])
;

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

  socket.socket.get('/sessionuser/' + userid, function (user) {
    $scope.user = user;
  });

  $scope.send = function (message, type) {
    $scope.newMessage = "";
    $scope.messages.push({
      id: -1,
      type: type,
      message: message,
      createdAt: new Date(),
      from: SessionService.user.user,
      sent: false,
      received: false
    })
    socket.socket.post('/sessionuser/message/', {
      to: userid,
      message: message,
      type: type
    }, function (data) {
      $scope.$apply(function () {
        var messageSent = _.findIndex($scope.messages, {id: -1});
        $scope.messages[messageSent] = data;
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
      });

      socket.emit('put', '/conversations/' + message.data.id + '/received');

    } else {
      $cordovaLocalNotification.add({
        id: 'com.help.upplus4.notification.message',
        title: 'Mensaje recibido',
        message: message.data.from.name + ': ' + message.data.type == 'text' ? message.data.message : 'Imagen',
        json: {to: message.data.from.userid}
      }).then(function (arg) {
        console.log(arg);
      });
    }
  });

  $scope.$on('conversation.updated', function (evt, message) {
    var conversationIndex = _.findIndex($scope.messages, {id: message.id});
    console.log('conv act', conversationIndex, message);
    $scope.$apply(function () {
      $scope.messages[conversationIndex].received = true;
    })
  });

  /**
   * @return {boolean}
   */
  $scope.ISentIt = function (from) {
    return from.userid === SessionService.user.id;
  };

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

controllers.controller("MensajesCtrl", ["$scope", "socket", "$state", function ($scope, socket, $state) {
  socket.emit('get', '/conversations', function (data) {
    $scope.$apply(function () {
      $scope.conversations = data;
    });
  });

  $scope.goToChat = function (to) {
    $state.transitionTo('homepage.chat', {id: to});
  }
}]);
