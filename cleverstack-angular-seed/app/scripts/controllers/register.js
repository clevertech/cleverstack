define(['app'], function(app) {
    'use strict';

    app.controller('Register', ['$scope', '$auth', '$location',
        function($scope, $auth, $location) {

            $scope.submitted = false;
            $scope.busy = false;
            $scope.emailAvailable = false;
            $scope.formMessage = "";
            /* alert-success, alert-warning, alert-info, alert-danger */
            $scope.formMessageClass = "alert-info";

            $scope.register = function() {
                if ($scope.registerForm.$valid) {
                    console.log('submitting form...');
                    $auth.register($scope.credentials);

                } else {
                    console.log('form invalid!');
                    $scope.submitted = true;
                }
            }

            $scope.$on('$auth:registerSuccess', function(event, data) {
                console.log("RegisterController:", event, data);
                $scope.formMessageClass = "alert-success";
                $scope.formMessage = "Register success.";
            });

            $scope.$on('$auth:registerFailure', function(event, data) {
                console.log("RegisterController:", event, data);
                $scope.formMessageClass = "alert-danger";
                $scope.formMessage = "Register failed, please check details and try again.";
            });

        }
    ]);
});
