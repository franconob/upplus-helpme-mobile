angular.module("helpme", ["ionic", "restangular", "helpme.controllers", "helpme.services", "helpme.directives", "helpme.filters", "ngCordova", "igTruncate"]).run(function ($ionicPlatform, $rootScope, SessionService, $state) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }


        window.plugin.notification.local.onclick = function (id, state, json) {
            alert(JSON.parse(json).from);
            $rootScope.$broadcast('notification.local.click', {id: id, state: state, json: JSON.parse(json)});
            //window.location.href = '/#/home/proveedores/chat/' + JSON.parse(json).from;
        };

    });


    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        if (toState.data.requiresLogin && !SessionService.authenticated) {
            event.preventDefault();
            $state.transitionTo('login');
        }
    })
}).config(function ($stateProvider, $urlRouterProvider, RestangularProvider, socketProvider, $httpProvider) {
    RestangularProvider.setBaseUrl(ENDPOINT);
    RestangularProvider.setFullResponse(true);
    socketProvider.setIo(io);
    $stateProvider
        .state('root', {
            url: '/',
            controller: function ($state) {
                $state.transitionTo('login')
            },
            data: {
                requiresLogin: false
            }
        })
        .state("login", {
            url: "/login",
            templateUrl: "templates/login.html",
            controller: "LoginCtrl",
            data: {
                requiresLogin: false
            }
        }).state("homepage", {
            url: "/home",
            abstract: true,
            controller: "HomepageCtrl",
            templateUrl: 'templates/menu.html',
            data: {
                requiresLogin: true
            }
        }).state("homepage.proveedores", {
            url: "/proveedores",
            views: {
                'menuContent': {
                    templateUrl: "templates/proveedores.html",
                    controller: "ProveedoresCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        }).state("homepage.messages", {
            url: "/proveedores/messages",
            views: {
                menuContent: {
                    templateUrl: "templates/proveedores/messages.html",
                    controller: "MessagesCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        }).state("homepage.chat", {
            url: "/proveedores/chat/:id",
            views: {
                menuContent: {
                    templateUrl: "templates/proveedores/show.html",
                    controller: "ChatCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        }).state("homepage.profile", {
            url: '/profile/:id',
            views: {
                menuContent: {
                    templateUrl: "templates/proveedores/profile/profile.html",
                    controller: "ProfileCtrl"
                }
            }
        });

    $urlRouterProvider.otherwise("/");

    $httpProvider.interceptors.push("TokenInterceptor");
});

ionic.Platform.ready(function () {

    window.plugin.notification.local.onclick = function (id, state, json) {
        if (id == 'com.help.upplus4.notification.message') {
            $scope.apply(function () {
                $state.transitionTo('homepage.chat', {id: json.from})
            })
        }
    };

    /*
    window.navigator.geolocation.getCurrentPosition(function(location) {
        console.log('Location from Phonegap', location);
    });

    var bgGeo = window.plugins.backgroundGeoLocation;

    var callbackFn = function(location) {
        console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //
        yourAjaxCallback.call(this);
    };

    var failureFn = function(error) {
        console.log('BackgroundGeoLocation error');
    }

    // BackgroundGeoLocation is highly configurable.
    bgGeo.configure(callbackFn, failureFn, {
        url: 'http://only.for.android.com/update_location.json', // <-- Android ONLY:  your server url to send locations to
        params: {
            auth_token: 'user_secret_auth_token',    //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
            foo: 'bar'                              //  <-- Android ONLY:  HTTP POST params sent to your server when persisting locations.
        },
        headers: {                                   // <-- Android ONLY:  Optional HTTP headers sent to your configured #url when persisting locations
            "X-Foo": "BAR"
        },
        desiredAccuracy: 10,
        stationaryRadius: 20,
        distanceFilter: 30,
        notificationTitle: 'Background tracking', // <-- android only, customize the title of the notification
        notificationText: 'ENABLED', // <-- android only, customize the text of the notification
        activityType: 'AutomotiveNavigation',
        debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false // <-- enable this to clear background location settings when the app terminates
    });

    // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();
    */

});
