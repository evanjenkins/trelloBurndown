'use strict';

angular.module('mean.organization').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('organization example page', {
      url: '/organization/example',
      templateUrl: 'organization/views/index.html'
    });
  }
]);
