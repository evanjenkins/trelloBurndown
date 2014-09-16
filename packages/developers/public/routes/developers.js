'use strict';

//Setting up route
angular.module('mean.developers').config(['$stateProvider',
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

    // states for my app
    $stateProvider
      .state('all developers', {
        url: '/developers',
        templateUrl: 'developers/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create developer', {
        url: '/developers/create',
        templateUrl: 'developers/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit developer', {
        url: '/developers/:developerId/edit',
        templateUrl: 'developers/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('developer by id', {
        url: '/developers/:developerId',
        templateUrl: 'developers/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
