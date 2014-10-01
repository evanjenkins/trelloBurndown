'use strict';

angular.module('mean.organization').controller('OrganizationController', ['$scope', 'Global', 'Organization', '$location',
  function($scope, Global, Organization, $location) {
    $scope.global = Global;
    $scope.package = {
      name: 'organization'
    };

    /**
    * Creates a board.
    * @param isValid
    */
    $scope.create = function(isValid) {
      if (isValid) {

        this.title = '';
        this.content = '';
      } else {
        $scope.submitted = true;
      }
    };
  }
]);
