define(['app'], function (app) {
  'use strict';

  app.controller('Users', ['$scope', '$auth', '$injector'
    , function ($scope, $auth, $injector) {

        // inject the user service if it doesn't exist
        if(!$scope.userService) {
            $scope.userService = $injector.get('UserService');
        }

        // get all users
        $scope.users = $scope.userService.getUsers();

        // update current user when it changes
        $scope.$watch($auth.getCurrentUser, function () {
            $scope.user = $auth.getCurrentUser() || false;
        });

  }]);

});
