define(['angular', 'app'], function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name ngSeed.directives:pwCheck
   * @description
   * Simply checks if two passwords match.
   */
  angular
    .module('app.directives')
    .directive('pwCheck', function() {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pwCheck;
                $(elem).add(firstPassword).on('keyup', function () {
                    scope.$apply(function () {
                        var v = elem.val()===$(firstPassword).val();
                        ctrl.$setValidity('pwcheck', v);
                    });
                });
            }
        }
    });

});
