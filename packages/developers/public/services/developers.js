'use strict';

/* Services */

//Articles service used for articles REST endpoint
angular.module('mean.developers').factory('DevResource', ['$resource',
  function($resource) {
    return $resource('developers/:developerId', {
      developerId: '@_id'
    }, {
      update: {
        method: 'PUT',
        params: {
          developerId: '@_id'
        }
      },
      find: {
        method: 'GET'
      }
    });
  }
]);

//angular.module('mean.developers').factory('DevFinder', ['$resource',
//  function($resource) {
//    return $resource('developers/find', {
//    }, {
//      find: {
//        method: 'GET'
//      },
//      update: {
//        method: 'PUT',
//        userId: '@userId'
//      }
//    });
//  }
//]);

//Articles service used for articles REST endpoint
angular.module('mean.developers').factory('Devs', function($resource, $q, $http) {
  var api = {};

  api.getMember = function(memberId, key) {
    var deferred = $q.defer(),
      url = 'https://api.trello.com/1/members/' + memberId + '?key=' + key;

    $http({method: 'GET', url: url}).
      success(function (data, status, headers, config) {
        deferred.resolve(data);
      }).
      error(function (data, status, headers, config) {
        deferred.reject(status);
      });
    return deferred.promise;
  };

  return api;
  }
);

