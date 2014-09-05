# Ionic Starter App

# angular.module is a global place for creating, registering and retrieving Angular modules
# 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
# the 2nd parameter is an array of 'requires'
# 'starter.controllers' is found in controllers.js

# Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
# for form inputs)

# org.apache.cordova.statusbar required
angular.module("fitSOS", [
  "ionic"
  "fitSOS.controllers"
]).run(($ionicPlatform) ->
  $ionicPlatform.ready ->
    cordova.plugins.Keyboard.hideKeyboardAccessoryBar true  if window.cordova and window.cordova.plugins.Keyboard
    StatusBar.styleDefault()  if window.StatusBar
    return

  return
).config ($stateProvider, $urlRouterProvider) ->
  $stateProvider.state("login",
    url: "/login"
    templateUrl: "templates/login.html"
    controller: "LoginCtrl"
  ).state("homepage",
    url: "/"
    templateUrl: "templates/homepage.html"
    controller: "HomepageCtrl"
  ).state("proveedores",
    url: "/proveedores"
    templateUrl: "templates/proveedores.html"
    controller: "ProveedoresCtrl"
  )

  # if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise "/"
  return

