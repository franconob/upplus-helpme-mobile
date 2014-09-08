angular.module("fitSOS", ["ionic", "restangular", "fitSOS.controllers", "fitSOS.services"]).run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
}).config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl("http://192.168.56.1:1337");
    //RestangularProvider.setJsonp(true);
    //RestangularProvider.setDefaultRequestParams('jsonp', {callback: 'JSON_CALLBACK'});
    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: "LoginCtrl"
    }).state("homepage", {
        url: "/",
        templateUrl: "templates/homepage.html",
        controller: "HomepageCtrl"
    }).state("proveedores", {
        url: "/proveedores",
        templateUrl: "templates/proveedores.html",
        controller: "ProveedoresCtrl"
    }).state("chat", {
        url: "/proveedores/chat",
        templateUrl: "templates/proveedores/show.html",
        controller: "ProveedoresCtrl"
    });

    $urlRouterProvider.otherwise("/");
});

ionic.Platform.ready(function () {
    return console.log(window.plugins.BackgroundJS);
});
