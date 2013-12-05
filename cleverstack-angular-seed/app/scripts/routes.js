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
        templateUrl: t.view('register'),
        controller: 'Register',
        public: true
      })
      .when('/dashboard', {
        templateUrl: t.view('dashboard'),
        controller: 'Dashboard'
      })
      .when('/node', {
        templateUrl: t.view('node'),
        controller: 'Node'
      })
      .when('/angular', {
        templateUrl: t.view('angular'),
        controller: 'Angular'
      })
      .when('/clevertech', {
        templateUrl: t.view('clevertech'),
        controller: 'Clevertech'
      })
      .when('/chat', {
        templateUrl: t.view('chat'),
        controller: 'ChatCtrl'
      })
      .when('/stats', {
        templateUrl: t.view('stats'),
        controller: 'Stats'
      })

      //node seed
      .when('/node/grunt', {
        templateUrl: t.view('node/grunt'),
        controller: 'Node'
      })
      .when('/node/backgroundtasks', {
        templateUrl: t.view('node/backgroundtasks'),
        controller: 'Node'
      })
      .when('/node/tests', {
        templateUrl: t.view('node/tests'),
        controller: 'Node'
      })
      .when('/node/deployment', {
        templateUrl: t.view('node/deployment'),
        controller: 'Node'
      })

      //angular seed
      .when('/angular/grunt', {
        templateUrl: t.view('angular/grunt'),
        controller: 'Angular'
      })
      .when('/angular/deployment', {
        templateUrl: t.view('angular/deployment'),
        controller: 'Angular'
      })

      //clevertech
      .when('/clevertech/modularity', {
        templateUrl: t.view('clevertech/modularity'),
        controller: 'Clevertech'
      })
      .when('/clevertech/cli', {
        templateUrl: t.view('clevertech/cli'),
        controller: 'Clevertech'
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