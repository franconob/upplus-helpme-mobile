angular.module("fitSOS", ["ionic", "fitSOS.controllers"]).run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
}).config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state("app", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginCtrl"
  });
  $urlRouterProvider.otherwise("/login");
});
