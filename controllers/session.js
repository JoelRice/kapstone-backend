const User = require('../models/User');
const Session = require('../models/Session');
const tokenGen = require('../tokenGenerator');

module.exports = {
  create: (req, res, next) => {
    User.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user === null || user.password !== req.body.password) {
        throw 'Incorrect username or password';
      }
      return Session.create({
        token: tokenGen.next(),
        user: user._id,
      });
    }).then((session) => {
      res.locals.session = session;
      next();
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  },
  deleteByToken: (req, res, next) => {
    Session.findOneAndDelete({
      token: req.body.token,
    }).then((session) => {
      if (session === null) {
        throw 'Invalid token';
      }
      res.locals.session = session;
      next();
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  },
};