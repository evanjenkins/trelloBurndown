'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Organization = mongoose.model('Organization'),
  _ = require('lodash');


/**
 * Find organization by id
 */
exports.organization = function(req, res, next, id) {
  Organization.load(id, function(err, org) {
    if (err) return next(err);
    if (!org) return next(new Error('Failed to load organization ' + id));
    req.organization = org;
    next();
  });
};

/**
 * Create an Organization
 */
exports.create = function(req, res) {
  var org = new Organization(req.body);
  org.user = req.user;

  org.save(function(err) {
    if (err) {
      return res.json(500, {
        error: err
      });
    }
    res.json(org);
  });
};


/**
 * Update an Organization
 */
exports.update = function(req, res) {
  var org = req.organization;

  org = _.extend(org, req.body);
  org.save(function(err) {
    if (err) {
      return res.json(500, {
        error: 'Cannot update the developer'
      });
    }
    res.json(org);

  });
};

/**
 * Delete a developer
 */
exports.destroy = function(req, res) {
  var org = req.organization;

  org.remove(function(err) {
    if (err) {
      return res.json(500, {
        error: err
      });
    }
    res.json(org);

  });
};

/**
 * Show a developer
 */
exports.show = function(req, res) {
  res.json(req.organization);
};

/**
 * List of Developers
 */
exports.all = function(req, res) {
  if (req.query.orgId) {
    Organization.loadByUserId(req.query.orgId, function(err, organization) {
      if (err) return res.json({'error': true});
      if (!organization) return res.json({'status': false});
      req.status = true;
      req.organization = organization;
      res.json(organization);
    });
  }
  else {
    Organization.find().sort('-created').populate('user', 'name username').exec(function(err, organizations) {
      if (err) {
        return res.json(500, {
          error: 'Cannot list the developers'
        });
      }
      res.json(organizations);

    });
  }
};
