'use strict';

var developers = require('../controllers/developers');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.developer.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Developers, app, auth) {

  app.route('/developers')
    .get(developers.all)
    .post(auth.requiresLogin, developers.create)
    .put(auth.requiresLogin, hasAuthorization, developers.update);
  app.route('/developers/find')
    .get(developers.find)
    .put(auth.requiresLogin, hasAuthorization, developers.update);
  app.route('/developers/:developerId')
    .get(developers.show)
    .put(auth.requiresLogin, hasAuthorization, developers.update)
    .delete(auth.requiresLogin, hasAuthorization, developers.destroy);

  // Finish with setting up the articleId param
  app.param('developerId', developers.developer);
};
