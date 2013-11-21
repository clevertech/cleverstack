define(['angular', 'app'], function (angular) {
  'use strict';

  /**
   * @ngdoc directive
   * @name ngSeed.directives:navbar
   * @description
   * Sets the current navbar option in focus.
   */
  angular
    .module('app.directives')
    .directive('navbar', function($location) {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                heading: '@'
            },
            controller: 'Navbar',
            templateUrl: 'views/partials/navbar.html',
            replace: true,
            link: function($scope, $element, $attrs, Navbar) {
                $scope.$location = $location;
                $scope.$watch('$location.path()', function(locationPath) {
                    Navbar.selectByUrl(locationPath)
                });
            }
        }
    });

});
