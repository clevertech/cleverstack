require.config({
    baseUrl: './scripts',
    paths: {
        angular: '../components/angular-unstable/angular',
        async: '../components/async/lib/async',
        jquery: '../components/jquery/jquery',
        underscore: '../components/underscore/underscore',
        ngResource: '../components/angular-resource-unstable/angular-resource',
        'http-auth-interceptor': '../components/angular-http-auth/src/http-auth-interceptor',
        bootstrap: '../components/bootstrap/dist/js/bootstrap',
        socketio: '../components/socket.io-client/dist/socket.io'
    },
    shim: {
        angular: {
            exports: 'angular'
        },

        'http-auth-interceptor': {
            deps: ['angular']
        },

        ngResource: {
            deps: ['angular', 'jquery']
        },

        bootstrap: {
            deps: ['jquery']
        },

        socketio: {
            exports: 'io'
        }
    }
});

require([
    'angular',
    'ngResource',
    'http-auth-interceptor',
    'socketio',

    // Init
    'app',

    // Config
    'routes',
    'config',

    // Controllers
    'controllers/home',
    'controllers/navbar',
    'controllers/login',
    'controllers/logout',
    'controllers/forgot',
    'controllers/register',
    'controllers/dashboard',
    'controllers/user',
    'controllers/users',
    'controllers/node',
    'controllers/angular',
    'controllers/clevertech',
    'controllers/chat',
    'controllers/stats',

    // Directives
    'directives/string-to-number',
    'directives/navbar',
    'directives/pwcheck',
    'directives/ngUnique',

    // Filters
    'filters/starts-with',
    'filters/currentUserToTop',

    // Services
    'services/debug',
    'services/http-options',
    'services/user',
    'services/templates',
    'services/browser-detect',
    'services/resource-factory',
    'services/auth',

    // Bootstrap
    'bootstrap'

], function(angular) {
    'use strict';

    angular.element(document).ready(function() {
        angular.bootstrap(document, ['app']);
    });
});
