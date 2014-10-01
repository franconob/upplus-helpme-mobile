/**
 * Created by fherrero on 24/09/14.
 */

angular.module('helpme.filters', [])
    .filter('default', function () {
        return function (input, text) {
            var _default = 'No indica';
            return input ? input : (text || _default);
        }
    });
