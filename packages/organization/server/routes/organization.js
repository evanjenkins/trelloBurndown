'use strict';

var organizations = require('../controllers/organization');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.developer.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};
// The Package is past automatically as first parameter
module.exports = function(Organization, app, auth, database) {

  app.route('/organizations')
    .get(organizations.all)
    .post(auth.requiresLogin, organizations.create)
    .put(auth.requiresLogin, hasAuthorization, organizations.update);
  app.route('/organizations/:organizationId')
    .get(organizations.show)
    .put(auth.requiresLogin, hasAuthorization, organizations.update)
    .delete(auth.requiresLogin, hasAuthorization, organizations.destroy);

  //app.get('/organization/example/anyone', function(req, res, next) {
  //  res.send('Anyone can access this');
  //});
  //
  //app.get('/organization/example/auth', auth.requiresLogin, function(req, res, next) {
  //  res.send('Only authenticated users can access this');
  //});
  //
  //app.get('/organization/example/admin', auth.requiresAdmin, function(req, res, next) {
  //  res.send('Only users with Admin role can access this');
  //});
  //app.get('/organization/example/render', function(req, res, next) {
  //  Organization.render('index', {
  //    package: 'organization'
  //  }, function(err, html) {
  //    //Rendering a view from the Package server/views
  //    res.send(html);
  //  });
  //});
};
