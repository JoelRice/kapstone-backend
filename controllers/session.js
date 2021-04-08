const User = require('../models/User');
const Session = require('../models/Session');
const ErrorChain = require('../handlers/errors');
const tokenGen = require('../tokenGenerator');

module.exports = {
  /** Create a session, overwriting any active ones for that user
   * @body username
   * @body password
   * @locals user
   * @locals session
   */
  create: (req, res, next) => {
    User.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user === null || user.password !== req.body.password) {
        throw 'Incorrect username or password';
      }
      res.locals.user = user;
      return Session.findOneAndDelete({
        user: user._id,
      });
    }).then((deletedSession) => (
      Session.create({
        token: tokenGen.next(),
        user: res.locals.user,
      })
    )).then((createdSession) => {
      res.locals.session = createdSession;
      next();
    }).catch((err) => {
      new ErrorChain(err, res)
        .database()
        .standard();
    });
  },

  /** Delete a session
   * @body token
   * @locals session
   */
  delete: (req, res, next) => {
    Session.findOneAndDelete({
      token: req.body.token,
    }).then((session) => {
      if (session === null) {
        throw 'Could not log out: not logged in';
      }
      res.locals.session = session;
      next();
    }).catch((err) => {
      new ErrorChain(err, res)
        .database()
        .standard();
    });
  },
};