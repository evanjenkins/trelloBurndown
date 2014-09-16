'use strict';

angular.module('mean.developers').controller('DevelopersController', ['$scope', '$stateParams', '$location', 'Global', 'DevResource', 'Devs', '$cookies',
  function($scope, $stateParams, $location, Global, DevResource, Devs, $cookies) {
    $scope.global = Global;
    $scope.trelloKey = $cookies.trelloKey;
    $scope.trelloToken = $cookies.trelloToken;
    $scope.addedDevs = [];

    /**
     * Checks if current user is authorized to perform action.
     * @param dev
     * @returns {*}
     */
    $scope.hasAuthorization = function(dev) {
      if (!dev || !dev.user) return false;
      return $scope.global.isAdmin || dev.user._id === $scope.global.user._id;
    };

    /**
     * Creates a board.
     * @param isValid
     */
//    $scope.create = function(isValid) {
//      if (isValid) {
//        var dev = new DevResource({
//          developerId: this.developerId,
//          name: $scope.devResult[this.developerId].name
//        });
//        dev.$save(function(response) {
//          $location.path('developers/' + response._id);
//        });
//
//        this.title = '';
//        this.content = '';
//      } else {
//        $scope.submitted = true;
//      }
//    };

    /**
     * Deletes a developer.
     * @param dev
     */
    $scope.remove = function(dev) {
      if (dev) {
        dev.$remove(dev.developerId);

        for (var i in $scope.devs) {
          if ($scope.devs[i].username === dev.username) {
            $scope.devs.splice(i, 1);
          }
        }
      } else {
        $scope.devs.$remove(function(response) {
          $location.path('developers');
        });
      }
    };

    /**
     * Updates a board.
     * @param isValid
     */
    $scope.update = function(isValid) {
      if (isValid) {
        var dev = $scope.dev;
        if (!dev.updated) {
          dev.updated = [];
        }
        dev.updated.push(new Date().getTime());

        dev.$update(function() {
          $location.path('developers/' + dev._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    /**
     * Finds all developers.
     */
    $scope.find = function() {
      DevResource.query(function(devs) {
        $scope.devs = devs;
      });
    };

    /**
     * Finds one board.
     */
    $scope.findOne = function() {
      DevResource.get({
        developerId: $stateParams.developerId
      }, function(dev) {
        $scope.dev = dev;
      });
    };

    /**
     * Gets all a board's members.
     * @param {string} boardId
     *  The board's string id from Trello.
     */
    $scope.getMembers = function(boardId) {
      var members = $scope.boardResult[boardId].memberships;

      $scope.boardMembers = [];
      angular.forEach(members, function(member, key) {
        var getMember = Devs.getMember(member.idMember, $scope.trelloKey);
        getMember.then(function(memberReturn) {
          $scope.boardMembers.push(memberReturn);
        });
      });
    };

  }
]);
