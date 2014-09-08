var controllers;

controllers = angular.module("fitSOS.controllers", []);

controllers.controller("LoginCtrl", function ($scope, $state) {
    $scope.loginData = {};
    return $scope.doLogin = function (loginData) {
        $state.transitionTo('proveedores');
    };
});

controllers.controller("HomepageCtrl", function ($scope) {
});

controllers.controller("ProveedoresCtrl", [
    "$scope", "Proveedores", function ($scope, Proveedores) {
        var req;
        req = Proveedores.getList();
        req.then(function (result) {
            return $scope.proveedores = result;
        }).catch(function (error) {
            console.log('error',error.message);
        });
    }
]);
