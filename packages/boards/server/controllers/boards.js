'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Board = mongoose.model('Board'),
  _ = require('lodash');


/**
 * Find board by id
 */
exports.board = function(req, res, next, id) {
  Board.load(id, function(err, board) {
    if (err) return next(err);
    if (!board) return next(new Error('Failed to load board ' + id));
    req.board = board;
    next();
  });
};

/**
 * Create an board
 */
exports.create = function(req, res) {
  var board = new Board(req.body);
  board.user = req.user;

  board.save(function(err) {
    if (err) {
      return res.json(500, {
        error: err
      });
    }
    res.json(board);
  });
};

/**
 * Update an board
 */
exports.update = function(req, res) {
  var board = req.board;

  board = _.extend(board, req.boardId);

  board.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the board'
      });
    }
    res.json(board);

  });
};

/**
 * Delete an board
 */
exports.destroy = function(req, res) {
  var board = req.board;

  board.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot delete the board'
      });
    }
    res.json(board);

  });
};

/**
 * Show an article
 */
exports.show = function(req, res) {
  res.json(req.board);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
  Board.find().sort('-created').populate('user', 'name username').exec(function(err, boards) {
    if (err) {
      return res.json(500, {
        error: 'Cannot list the boards'
      });
    }
    res.json(boards);

  });
};
