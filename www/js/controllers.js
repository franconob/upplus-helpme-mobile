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
    "$scope", "Users", function ($scope, Users) {
        var req;
        req = Users.getList();
        req.then(function (result) {
            return $scope.users = result;
        }).catch(function (error) {
            console.log('error', error.message);
        });
    }
]);

controllers.controller("ChatCtrl", ["$scope", "$stateParams", "Users", function ($scope, $stateParams, Users) {
    var userid = $stateParams.id;

    Users.one(userid).get().then(function (user) {
        $scope.user = user;
    });

    $scope.send = function(message) {
        console.log(message);
    }
}]);
