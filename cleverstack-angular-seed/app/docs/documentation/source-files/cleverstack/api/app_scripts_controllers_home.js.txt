define(['app'], function (app) {
  'use strict';

  app.controller('Home', ['$scope', '$auth', '$injector'
    , function ($scope, $auth, $injector) {

        // default greeting
        $scope.welcome = "Hello there!";

        // inject the user service if it doesn't exist
        if(!$scope.userService) {
            $scope.userService = $injector.get('UserService');
        }

        // update current user when it changes
        $scope.$watch($auth.getCurrentUser, function () {
            $scope.user = $auth.getCurrentUser();
        });

        // logged in greeting
        $scope.$watch($scope.user, function () {
            if ($scope.user) {
                $scope.welcome = "Welcome "+$scope.user.username+"!";
            }
        });

  }]);
});
