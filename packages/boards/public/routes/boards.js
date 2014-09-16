'use strict';

//Setting up route
angular.module('mean.boards').config(['$stateProvider',
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
      .state('all boards', {
        url: '/boards',
        templateUrl: 'boards/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create board', {
        url: '/boards/create',
        templateUrl: 'boards/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit board', {
        url: '/boards/:boardId/edit',
        templateUrl: 'boards/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('board by id', {
        url: '/boards/:boardId',
        templateUrl: 'boards/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);
