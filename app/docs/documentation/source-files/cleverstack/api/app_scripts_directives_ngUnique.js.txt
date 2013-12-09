define(['angular', 'app'], function(angular) {
    'use strict';

    /**
     * @ngdoc directive
     * @name ngSeed.directives:ngUnique
     * @description
     * Checks if an email is already present in the database.
     */
    angular
        .module('app.directives')
        .directive('ngUnique', function($http) {

            return {

                require: 'ngModel',

                link: function(scope, elem, attrs, ctrl) {

                    var $elem = $(elem);

                    // Trigger on blur of email input
                    $elem.on('blur', function(evt) {

                        // Check when the email is valid first
                        if (scope.registerForm.email.$valid && !scope.emailAvailable) {

                            // We're out of Angular here so we need to apply to scope
                            scope.$apply(function() {

                                console.log('checking email is available...');
                                scope.busy = true;

                                // Ajax request to check if email is available
                                $http({
                                    method: 'POST',
                                    url: '/user/isEmailAvailable',
                                    data: {
                                        "email": $elem.val(),
                                        "dbField": attrs.ngUnique
                                    }
                                }).
                                success(function(data, status, headers, config) {
                                    console.log('ajax success...' + data.status);
                                    // Set email is available/not available.
                                    ctrl.$setValidity('unique', data.status);
                                    scope.busy = false;
                                    if (data.status) {
                                        scope.emailAvailable = true;
                                    } else {
                                        scope.emailAvailable = false;
                                    }
                                }).
                                error(function(data, status, headers, config) {
                                    console.log("ajax fail...(" + status + ").");
                                    ctrl.$setValidity('unique', true);
                                    scope.busy = false;
                                });

                            });
                        } else {
                            scope.emailAvailable = false;
                            ctrl.$setValidity('unique', true);
                        }

                    });

                }

            }

        });

});
