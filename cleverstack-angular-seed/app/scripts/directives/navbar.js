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
            replace: true,
            transclude: true,
            templateUrl: 'views/partials/navbar.html',
            scope: {
                heading: '@'
            },
            controller: 'Navbar',
            link: function($scope, $element, $attrs, Navbar) {
                $scope.$location = $location;
                $scope.$watch('$location.path()', function(locationPath) {
                    var $li, link,
                        $liElements = $element.find("li");

                    $.each($liElements, function(i, v)
                    {
                        $li = $($liElements[i]);
                        link = $li.find("a").attr('href');
                        // if (link.toLowerCase().indexOf(locationPath) >= 0) {
                        if (link.toLowerCase() == locationPath) {
                           $li.addClass("active");
                        }
                        else {
                           $li.removeClass("active");
                        }
                    });

                });
            }
        }
    });

});
