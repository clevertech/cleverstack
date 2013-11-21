define(['app'], function (app) {
  'use strict';

  app.controller('Navbar', ['$scope', '$auth'
    , function ($scope, $auth) {

    $scope.user = false;
    $scope.$watch($auth.getCurrentUser, function () {
        $scope.user = $auth.getCurrentUser() || false;
    });

    var items = $scope.items = [
    {
        title: 'Home',
        link: 'dashboard'
    },
    {
        title: 'Queries',
        link: 'query'
    },
    {
        title: 'Statistics',
        link: 'stats'
    }];

    this.select = $scope.select = function(item) {
        angular.forEach(items, function(item) {
            item.selected = false;
        });
        item.selected = true;
    };

    this.selectByUrl = function(url) {
        angular.forEach(items, function(item) {
            if ('/' + item.link === url) {
                $scope.select(item);
            }
        });
    };

  }]);

});