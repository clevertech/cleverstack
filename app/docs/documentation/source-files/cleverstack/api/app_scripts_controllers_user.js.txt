define(['app'], function (app) {
  'use strict';

  app.controller('User', ['$scope', '$auth', '$injector'
    , function ($scope, $auth, $injector) {

        // update current user when it changes
        $scope.$watch($auth.getCurrentUser, function () {
            $scope.user = $auth.getCurrentUser() || false;
        });

        // update demo links
        $scope.baseUrl = window.location.protocol+"//"+window.location.hostname;

  }]);

});
