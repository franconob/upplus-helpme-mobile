angular.module("fitSOS.controllers", []).controller("LoginCtrl", function($scope, $ionicModal, $timeout) {
  var plugin;
  $scope.loginData = {};
  plugin = CC.CordovaFacebook();
  plugin.init('asdasdsad', 'FinderIT', [], function(response) {
    return console.log(response);
  });
  $scope.doLogin = function() {
    console.log("Doing login", $scope.loginData);
  };
});
