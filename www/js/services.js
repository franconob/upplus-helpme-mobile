(angular.module("fitSOS.services", [])).factory("Users", [
  "Restangular", function(Restangular) {
    return Restangular.service('user');
  }
]);
