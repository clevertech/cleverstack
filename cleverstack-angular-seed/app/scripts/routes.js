define(['angular', 'app'], function (angular, app) {

  'use strict';

  app.config(
    ['$routeProvider', '$templatesProvider'
    , function ($routeProvider, $templatesProvider) {

    var t = $templatesProvider;

    $routeProvider
      .when('/', {
        templateUrl: t.view('home'),
        controller: 'Home',
        public: true
      })
      .when('/user', {
        templateUrl: t.view('user'),
        controller: 'User'
      })
      .when('/users', {
        templateUrl: t.view('users'),
        controller: 'Users'
      })
      .when('/login', {
        templateUrl: t.view('login'),
        controller: 'Login',
        public: true
      })
      .when('/logout', {
        templateUrl: t.view('login'),
        controller: 'Logout',
        public: true
      })
      .when('/forgot', {
        templateUrl: t.view('forgot'),
        controller: 'Forgot',
        public: true
      })
      .when('/register', {
        templateUrl: t.view('registration'),
        controller: 'Registration',
        public: true
      })
      .when('/node', {
        templateUrl: t.view('node'),
        controller: 'Node',
        public: true
      })
      .when('/angular', {
        templateUrl: t.view('angular'),
        controller: 'Angular',
        public: true
      })
      .when('/error', {
        templateUrl: t.partial('error'),
        public: true
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

});