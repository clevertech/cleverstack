define(['app'], function (app) {
  'use strict';

  app.controller('Forgot', ['$scope', '$auth', '$location'
  , function ($scope, $auth, $location) {

    $scope.submitted = false;
    $scope.formMessage = "";
    /* alert-success, alert-warning, alert-info, alert-danger */
    $scope.formMessageClass = "alert-info";

    $scope.forgot = function () {
        if ($scope.forgotForm.$valid) {
            console.log('submitting form...');
            $auth.forgot($scope.credentials);

        } else {
            console.log('form invalid!');
            $scope.submitted = true;
        }
    }

    $scope.$on('$auth:forgotSuccess', function (event, data) {
        console.log("forgotController:",event,data);
        $scope.formMessageClass = "alert-success";
        $scope.formMessage = "forgot success.";
    });

    $scope.$on('$auth:forgotFailure', function (event, data) {
        console.log("forgotController:",event,data);
        $scope.formMessageClass = "alert-danger";
        $scope.formMessage = "Username or password incorrect.";
    });

  }]);

});
