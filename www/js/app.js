angular.module("fitSOS", ["ionic", "restangular", "fitSOS.controllers", "fitSOS.services", "ngCordova"]).run(function ($ionicPlatform, $rootScope, SessionService, $state) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

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
    socketProvider.setSocket(sock);
    $stateProvider
        .state('root', {
            url: '/',
            controller: function($state) {
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
            url: "/home/proveedores",
            views: {
                'menuContent': {
                    templateUrl: "templates/proveedores.html",
                    controller: "ProveedoresCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        }).state("homepage.chat", {
            url: "/home/proveedores/chat/:id",
            views: {
                menuContent: {
                    templateUrl: "templates/proveedores/show.html",
                    controller: "ChatCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        }).state("homepage.messages", {
            url: "/home/proveedores/messages",
            views: {
                menuContent: {
                    templateUrl: "templates/proveedores/messages.html",
                    controller: "MessagesCtrl"
                }
            },
            data: {
                requiresLogin: true
            }
        });

    $urlRouterProvider.otherwise("/");

    $httpProvider.interceptors.push("TokenInterceptor");
});

ionic.Platform.ready(function () {

});
