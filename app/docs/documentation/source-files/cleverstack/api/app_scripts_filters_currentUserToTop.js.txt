define(['angular', 'app'], function(angular) {
    'use strict';

    /**
     * @ngdoc filter
     * @name ngSeed.filters:currentUserToTop
     * @description
     *
     * Custom filter to move the current user to the top of the list
     * users = array of user obj's
     * current = user id
     *
     */
    angular
        .module('app.filters')
        .filter('currentUserToTop', function() {
            return function(users, current) {
                var newList = [];
                angular.forEach(users, function(u) {
                    if (u.id == current) {
                        newList.unshift(u);
                    } else {
                        newList.push(u);
                    }
                });
                return newList;
            };
        });
});
