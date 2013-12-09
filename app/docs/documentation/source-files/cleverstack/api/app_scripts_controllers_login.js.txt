define(['app'], function (app) {
  'use strict';

  app.controller('Login', ['$scope', '$auth', '$location'
  , function ($scope, $auth, $location) {

    $scope.submitted = false;
    $scope.formMessage = "";
    /* alert-success, alert-warning, alert-info, alert-danger */
    $scope.formMessageClass = "alert-info";

    $scope.login = function () {
        if ($scope.loginForm.$valid) {
            console.log('submitting form...');
            $auth.login($scope.credentials);

        } else {
            console.log('form invalid!');
            $scope.submitted = true;
        }
    }

    $scope.$on('$auth:loginSuccess', function (event, data) {
        console.log("LoginController:",event,data);
        $scope.formMessageClass = "alert-success";
        $scope.formMessage = "Login success.";
    });

    $scope.$on('$auth:loginFailure', function (event, data) {
        console.log("LoginController:",event,data);
        $scope.formMessageClass = "alert-danger";
        $scope.formMessage = "Username or password incorrect.";
    });

  }]);

});
