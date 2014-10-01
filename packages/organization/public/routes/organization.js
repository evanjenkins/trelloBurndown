'use strict';

//Setting up route
angular.module('mean.organization').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // Check if the user is connected
    var checkAdmin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0' && user.roles.indexOf('admin') !== -1) $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all organizations', {
        url: '/organizations',
        templateUrl: 'organization/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create organization', {
        url: '/organizations/create',
        templateUrl: 'organization/views/create.html',
        resolve: {
          loggedin: checkAdmin
        }
      })
      .state('edit organization', {
        url: '/organizations/:organizationId/edit',
        templateUrl: 'organization/views/edit.html',
        resolve: {
          loggedin: checkAdmin
        }
      })
      .state('organization by id', {
        url: '/organizations/:organizationId',
        templateUrl: 'organization/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
