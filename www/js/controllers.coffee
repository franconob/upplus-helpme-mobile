# Form data for the login modal

# Create the login modal that we will use later

# Triggered in the login modal to close it

# Open the login modal

# Perform the login action when the user submits the login form

# Simulate a login delay. Remove this and replace with your login
# code if using a login system

controllers = angular.module("fitSOS.controllers", [])

controllers.controller "LoginCtrl", ($scope, $state) ->
  $scope.loginData = {}

  $scope.doLogin = (loginData)->
    $state.transitionTo('proveedores')
    return

controllers.controller "HomepageCtrl", ($scope) ->
  return

controllers.controller "ProveedoresCtrl", ($scope) ->
  $scope.proveedores = [
    nombre: "Franco"
    apellido: "Herrero",
    nombre: "Victor"
    apellido: "Herrero"
  ]


