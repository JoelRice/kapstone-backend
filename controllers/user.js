const User = require('../models/User');
const Session = require('../models/Session');
const ErrorChain = require('../handlers/errors');

module.exports = {
  /** Get info about the user you're logged in as
   * @body token
   * @locals user
   */
  get: (req, res, next) => {
    Session.findOne({
      token: req.body.token,
    }).then((session) => {
      if (session === null) {
        throw 'Invalid token';
      }
      return User.findById(session.user);
    }).then((user) => {
      res.locals.user = user;
      next();
    }).catch((err) => {
      new ErrorChain(err)
        .database()
        .standard();
    });
  },
  /** Create as a user if it doesn't already exist
   * @body username
   * @body password
   * @locals user
   */
  create: (req, res, next) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
      isAdmin: false,
      balance: 500,
    }).then((user) => {
      res.locals.user = user;
      next();
    }).catch((err) => {
      new ErrorChain(err, res)
        .dupe('Someone already has that name')
        .database()
        .standard();
    });
  },

  /** Delete a user
   * @body token
   * @body password
   * @locals user
   */
  delete: (req, res, next) => {
    Session.findOne({
      token: req.body.token,
    }).then((session) => {
      if (session === null) {
        throw 'Invalid token';
      }
      return User.findById(session.user);
    }).then((user) => {
      if (user.password !== req.body.password) {
        throw 'Incorrect password';
      }
      return User.findByIdAndDelete(user._id);
    }).then((user) => {
      res.locals.user = user;
      next();
    }).catch((err) => {
      new ErrorChain(err, res)
        .database()
        .standard();
    });
  },
};