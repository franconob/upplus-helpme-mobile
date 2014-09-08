(angular.module("fitSOS.services", [])).factory("Proveedores", [
  "Restangular", function(Restangular) {
    return Restangular.service('proveedores');
  }
]);
