'use strict';

angular.module('mean.boards').controller('BoardsController', ['$scope', '$stateParams', '$location', 'Global', 'BoardResource', 'Boards', 'sharedProperties', '$cookies', 'DevResource',
  function($scope, $stateParams, $location, Global, BoardResource, Boards, sharedProperties, $cookies, DevResource) {
    $scope.global = Global;
    $scope.validKey = false;
    $scope.validToken = false;
    $scope.addedDevs = [];

    /**
     * Checks if current user is authorized to perform action.
     * @param board
     * @returns {*}
     */
    $scope.hasAuthorization = function(board) {
      if (!board || !board.user) return false;
      return $scope.global.isAdmin || board.user._id === $scope.global.user._id;
    };

    /**
     * Creates a board.
     * @param isValid
     */
    $scope.create = function(isValid) {
      if (isValid) {
        var board = new BoardResource({
          boardId: this.boardId,
          name: $scope.boardResult[this.boardId].name,
          devs: this.addedDevs,
          memberships: $scope.boardResult[this.boardId].memberships
        });

        // Save the devs if not already saved.
        angular.forEach($scope.addedDevs, function(dev, key) {
          var developer = new DevResource({
            developerId: dev.username,
            name: dev.fullName,
            avatarHash: dev.avatarHash,
            initials: dev.initials,
            email: dev.email,
            sizes: dev.size
          });
          developer.$save(function(response) {
          });
        });

        board.$save(function(response) {
          $location.path('boards/' + response._id);
        });


        this.title = '';
        this.content = '';
      } else {
        $scope.submitted = true;
      }
    };

    /**
     * Updates a board.
     * @param isValid
     */
    $scope.update = function(isValid) {
      if (isValid) {
        $scope.board.devs = $scope.addedDevs;
        var board = $scope.board;
        if (!board.updated) {
          board.updated = [];
        }
        board.updated.push(new Date().getTime());

        board.$update(function() {
          $location.path('boards/' + board._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    /**
     * Deletes a board.
     * @param board
     */
    $scope.remove = function(board) {
      if (board) {
        board.$remove();

        for (var i in $scope.boardResult) {
          if ($scope.boardResult[i] === board) {
            $scope.boardResult.splice(i, 1);
          }
        }
      } else {
        $scope.boardResult.$remove(function(response) {
          $location.path('boards');
        });
      }
    };

    /**
     * Makes object into an array.
     * @param boardResult
     * @returns {*|Array}
     */
    $scope.makeArray = function(boardResult) {
      return Object.keys(boardResult).map(function(k) { return boardResult[k];} );
    };

    /**
     * Finds all boards.
     */
    $scope.find = function() {
      BoardResource.query(function(boards) {
        $scope.boardResult = boards;
      });
    };

    /**
     * Finds one board.
     */
    $scope.findOne = function() {
      BoardResource.get({
        boardId: $stateParams.boardId
      }, function(board) {
        $scope.board = board;
        $scope.boardResult = {};
        $scope.boardResult[board.boardId] = board;
        $scope.trelloKey = $cookies.trelloKey;
        $scope.trelloToken = $cookies.trelloToken;
        $scope.addedDevs = board.devs;
        $scope.getMembers(board.boardId);
      });
    };

    /**
     * Function to get all boards with a key and token.
     * @param {string} key
     *  The key for this user.
     * @param {string} token
     *  The token for this user.
     */
    $scope.getBoards = function(key, token) {
      $scope.boardResult = {};
      var getBoards = Boards.getBoards(key, token);
      getBoards.then(function(boards) {
        angular.forEach(boards, function(board, key) {
          $scope.boardResult[board.id] = board;
        });
      }, function(reason) {
        alert('This token is invalid.');
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
        var getMember = Boards.getMember(member.idMember, $scope.trelloKey);
        getMember.then(function(memberReturn) {
          $scope.boardMembers.push(memberReturn);
        });
      });
    };

    /**
     * Adds a developer to a board.
     * @param {string} addDev
     *  The string id of the developer from Trello.
     */
    $scope.addNewDev = function(addDev) {
      var added = false;
      for (var i = 0; i < $scope.addedDevs.length; i++) {
        if ($scope.addedDevs[i].id === addDev.id) {
          added = true;
        }
      }
      if (!added) {
        addDev.sizes = {};
        $scope.addedDevs.push(addDev);
      }
    };

    /**
     * Removes a developer from a board.
     * @param {string} removeDev
     *  The string id of the developer from Trello.
     */
    $scope.removeNewDev = function(removeDev) {
      for (var i = 0; i < $scope.addedDevs.length; i++) {
        if ($scope.addedDevs[i].id === removeDev.id) {
          $scope.addedDevs.splice(i, 1);
        }
      }
    };

    /**
     * Removes a developer from a board.
     * @param {string} removeDev
     *  The string id of the developer from Trello.
     */
    $scope.removeDev = function(removeDev) {
      for (var i = 0; i < $scope.board.devs.length; i++) {
        if ($scope.board.devs[i].id === removeDev.id) {
          $scope.board.devs.splice(i, 1);
        }
      }
    };


    $scope.createBoard = function() {
      // Check cookies for a trello key.
      if ($cookies.trelloKey) {
        $scope.trelloKey = $cookies.trelloKey;
        $scope.validKey = true;
      }

      // Check cookies for a trello token.
      if ($cookies.trelloToken) {
        $scope.trelloToken = $cookies.trelloToken;
        $scope.validToken = true;
        sharedProperties.setToken($cookies.trelloToken);
        sharedProperties.setKey($cookies.trelloKey);
        $scope.getBoards($scope.trelloKey, $scope.trelloToken);
      }
    };

    // Validate a Key
    $scope.generateKey = function(key) {
      var checkKey = Boards.validateKey(key);
      checkKey.then(function(value) {
        $scope.trelloKey = key;
        $cookies.trelloKey = key;
        sharedProperties.setKey(key);
        $scope.validKey = true;

      }, function(reason) {
        alert('This key is invalid: ' + reason);
      });
    };

    // Validate a Token
    $scope.generateToken = function(token) {
      var checkToken = Boards.validateToken($scope.trelloKey, token);
      checkToken.then(function(value) {
        $cookies.trelloToken = token;

        $scope.validToken = true;
        sharedProperties.setToken(token);
        $scope.getBoards($scope.trelloKey, $scope.trelloToken);

      }, function(reason) {
        alert('This token is invalid: ' + reason);
      });
    };

  }
]);
