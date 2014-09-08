(angular.module "fitSOS.services", []).factory "Proveedores", ["Restangular", (Restangular) ->
  Restangular.service('proveedores')
]
