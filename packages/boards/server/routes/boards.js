'use strict';

var boards = require('../controllers/boards');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
  if (!req.user.isAdmin && req.board.user.id !== req.user.id) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

module.exports = function(Boards, app, auth) {

  app.route('/boards')
    .get(boards.all)
    .post(auth.requiresLogin, boards.create);
  app.route('/boards/:boardId')
    .get(boards.show)
    .put(auth.requiresLogin, hasAuthorization, boards.update)
    .delete(auth.requiresLogin, hasAuthorization, boards.destroy);

  // Finish with setting up the articleId param
  app.param('boardId', boards.board);
};
