define(['app'], function (app) {
  'use strict';

  app.controller('Forgot', ['$scope','$auth', function ($scope, $auth) {
    $auth.forgot();
  }]);
});