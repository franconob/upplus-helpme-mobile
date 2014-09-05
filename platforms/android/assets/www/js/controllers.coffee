
# Form data for the login modal

# Create the login modal that we will use later

# Triggered in the login modal to close it

# Open the login modal

# Perform the login action when the user submits the login form

# Simulate a login delay. Remove this and replace with your login
# code if using a login system
angular.module("fitSOS.controllers", []).controller("LoginCtrl", ($scope, $ionicModal, $timeout) ->
  $scope.loginData = {}

  plugin = CC.CordovaFacebook();
  plugin.init 'asdasdsad', 'FinderIT', [], (response) ->
    console.log response

  $scope.doLogin = ->
    console.log "Doing login", $scope.loginData
    return

  return
)

