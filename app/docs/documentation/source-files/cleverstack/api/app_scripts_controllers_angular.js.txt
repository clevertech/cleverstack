define(['app'], function(app) {
    'use strict';

    app.controller('Angular', ['$scope',
        function($scope) {

            // update demo links
            $scope.baseUrl = window.location.protocol + "//" + window.location.hostname;

        }
    ]);

});
