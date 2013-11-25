define(['app'], function (app) {
  'use strict';

  app.controller('Navbar', ['$scope', '$auth'
    , function ($scope, $auth) {

    $scope.user = false;
    $scope.$watch($auth.getCurrentUser, function () {
        $scope.user = $auth.getCurrentUser() || false;
    });

  }]);

});