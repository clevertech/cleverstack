define(['angular', 'app'], function(angular) {
    'use strict';

    /**
     * @ngdoc filter
     * @name ngSeed.filters:reverseArray
     * @description
     *
     * Reverses an array.
     *
     */
    angular
        .module('app.filters')
        .filter('reverseArray', function() {
            return function(items) {
                if (!angular.isArray(items)) return false;
                return items.slice().reverse();
            };
        });
});
