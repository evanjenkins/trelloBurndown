'use strict';

angular.module('mean.organization').controller('OrganizationController', ['$scope', 'Global', 'Organization',
  function($scope, Global, Organization) {
    $scope.global = Global;
    $scope.package = {
      name: 'organization'
    };
  }
]);
