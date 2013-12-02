define(['app'], function(app) {
    'use strict';

    app.controller('Node', ['$scope',
        function($scope) {

            // update demo links
            $scope.baseUrl = window.location.protocol + "//" + window.location.hostname;

        }
    ]);

});
