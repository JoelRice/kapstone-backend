const User = require('../models/User');
const Session = require('../models/Session');

module.exports = {
  create: (req, res, next) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
    }).then((user) => {
      req.user = user;
      next();
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  },
  deleteByToken: (req, res, next) => {
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
      res.status(400).json({ error: err });
    });
  },
};