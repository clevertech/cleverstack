define(['angular', 'app'], function(angular) {
    'use strict';

    /**
     * @ngdoc filter
     * @name ngSeed.filters:currentUserToTop
     * @description
     *
     * Custom filter to move the current user to the top of the list
     *
     * @example
     <doc:example>
      <doc:source>
       <style>
           li.current {
                color:red;
            }
       </style>
       <script>
        var app = angular.module('App', []);

        app.filter('currentUserToTop', function () {
            return function (users, current) {
                var newList = [];
                angular.forEach(users, function (u) {
                    if (u.id == current) {
                        newList.unshift(u);
                    }
                    else {
                        newList.push(u);
                    }
                });
                return newList;
            };
        });

        function Ctrl($scope) {

            $scope.user = {
                "id": 1
            };

            $scope.users = [{
                "id": 5,
                    "username": "sam"
            }, {
                "id": 6,
                    "username": "sam2"
            }, {
                "id": 4,
                    "username": "admin"
            }, {
                "id": 2,
                    "username": "user2"
            }, {
                "id": 3,
                    "username": "user3"
            }, {
                "id": 1,
                    "username": "user1"
            }];
        }
       </script>
        <div ng-app='App'>
            <div ng-controller="Ctrl">
                <p>Current uid:
                    <input ng-model="user.id" />
                </p>
                <p>Custom sort by name, then move current to top:</p>
                <ul>
                    <li data-ng-repeat="u in users | currentUserToTop:user.id" ng-class="{current:user.id==u.id}">{{u.id}} - {{u.username}}</li>
                </ul>
            </div>
        </div>
      </doc:source>
      <doc:scenario>
        it('should be current user to top', function() {
          element('input').value('2').enter();
          expect('ul.users').first().field('u.id')).toEqual('2');
        });
      </doc:scenario>
     </doc:example>
    */
    angular
        .module('app.filters')
        .filter('currentUserToTop', function() {
            return function(users, current) {
                var newList = [];
                angular.forEach(users, function(u) {
                    if (u.id == current) {
                        newList.unshift(u);
                    } else {
                        newList.push(u);
                    }
                });
                return newList;
            };
        });
});
