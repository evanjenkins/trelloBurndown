'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Developer = mongoose.model('Developer'),
  _ = require('lodash');


/**
 * Find developer by id
 */
exports.developer = function(req, res, next, id) {
  Developer.load(id, function(err, developer) {
    if (err) return next(err);
    if (!developer) return next(new Error('Failed to load developer ' + id));
    req.developer = developer;
    next();
  });
};

/**
 * Create a Developer
 */
exports.create = function(req, res) {
  var developer = new Developer(req.body);
  developer.user = req.user;

  developer.save(function(err) {
    if (err) {
      return res.json(500, {
        error: err
      });
    }
    res.json(developer);
  });
};


/**
 * Find a Developer
 */
exports.find = function(req, res, next) {
  Developer.loadByUserId(req.query.userId, function(err, developer) {
    if (err) return res.json({'error': true});
    if (!developer) return res.json({'status': false});
    req.status = true;
    req.developer = developer;
    res.json(developer);
  });
};

/**
 * Update a developer
 */
exports.update = function(req, res) {
  var developer = req.developer;

  developer = _.extend(developer, req.body);
  developer.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the developer'
      });
    }
    res.json(developer);

  });
};

/**
 * Delete a developer
 */
exports.destroy = function(req, res) {
  var developer = req.developer;

  developer.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: err
      });
    }
    res.json(developer);

  });
};

/**
 * Show a developer
 */
exports.show = function(req, res) {
  res.json(req.developer);
};

/**
 * List of Developers
 */
exports.all = function(req, res) {
  if (req.query.userId) {
    Developer.loadByUserId(req.query.userId, function(err, developer) {
      if (err) return res.json({'error': true});
      if (!developer) return res.json({'status': false});
      req.status = true;
      req.developer = developer;
      res.json(developer);
    });
  }
  else {
    Developer.find().sort('-created').populate('user', 'name username').exec(function(err, developers) {
      if (err) {
        return res.json(500, {
          error: 'Cannot list the developers'
        });
      }
      res.json(developers);

    });
  }
};
