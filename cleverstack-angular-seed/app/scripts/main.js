require.config({
  baseUrl: './scripts',
  paths: {
    angular: '../components/angular-unstable/angular',
    async: '../components/async/lib/async',
    jquery: '../components/jquery/jquery',
    underscore: '../components/underscore/underscore',
    ngResource: '../components/angular-resource-unstable/angular-resource',
    'http-auth-interceptor': '../components/angular-http-auth/src/http-auth-interceptor',
    bootstrap: '../components/bootstrap/dist/js/bootstrap'
  },
  shim: {
    angular: {
      exports: 'angular'
    },

    'http-auth-interceptor': {
      deps: ['angular']
    },

    ngResource: {
      deps: ['angular','jquery']
    },

    bootstrap: {
      deps: ['jquery']
    }
  }
});

require([
    'angular',
    'ngResource',
    'http-auth-interceptor',

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
    'controllers/registration',
    'controllers/dashboard',
    'controllers/user',
    'controllers/users',
    'controllers/node',
    'controllers/angular',
    'controllers/clevertech',

    // Directives
    'directives/string-to-number',
    'directives/navbar',

    // Filters
    'filters/starts-with',

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

  ], function (angular) {
  'use strict';

  angular.element(document).ready(function () {
    angular.bootstrap(document, ['app']);
  });
});