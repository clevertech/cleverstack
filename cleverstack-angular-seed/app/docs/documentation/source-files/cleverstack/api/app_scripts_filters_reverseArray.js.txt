define(['angular', 'app'], function(angular) {
    'use strict';

    /**
     * @ngdoc filter
     * @name ngSeed.filters:reverseArray
     * @description
     *
     * Reverses an array.
     *
     * @example
     <doc:example>
      <doc:source>
       <script>
            var app = angular.module('App', []);

            app.filter('reverseArray', function () {
                return function (items) {
                    if (!angular.isArray(items)) return false;
                    return items.slice().reverse();
                };
            });

            function Ctrl($scope) {

                $scope.numbers = [1, 2, 3, 4, 5];

            }
       </script>
           <div ng-controller="Ctrl">
            <ul>
                <li>Normal: <span ng-repeat="n in numbers">{{ n }} </span></li>
                <li class="reversed">reverseArray: <span ng-repeat="n in numbers | reverseArray">{{ n }} </span></li>
            </ul>
           </div>
      </doc:source>
      <doc:scenario>
        it('should be reverse ordered array', function() {
          expect(repeater('li.reversed span', 'n in numbers')).
            toEqual(['5', '4', '3', '2', '1']);
        });
      </doc:scenario>
     </doc:example>
    */
    angular
        .module('app.filters')
        .filter('reverseArray', function() {
            return function(items) {
                if (!angular.isArray(items)) return false;
                return items.slice().reverse();
            };
        });
});
