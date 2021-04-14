const errors = require('../handlers/errors');

const User = require('../models/User');
const Session = require('../models/Session');

const tokenGen = require('../tokenGenerator');

module.exports = {
  /** Read a user via session
   * @body token
   */
  read: (req, res) => {
    Session.findOne({
      token: req.body.token,
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((user) => {
      res.status(200).json({
        username: user.username,
        balance: user.balance,
        isAdmin: user.isAdmin,
      });
    }).catch(errors.standard(res));
  },
  /** Create a session
   * @body username
   * @body password
   */
  create: (req, res) => {
    User.findOne({
      username: req.body.username,
      password: req.body.password,
    }).then((foundUser) => {
      errors.inline.badCredentials(foundUser);
      return Session.create({
        token: tokenGen.next(),
        user: foundUser._id,
      });
    }).then((createdSession) => {
      res.status(200).json({ message: 'Successfully logged in', token: createdSession.token });
    }).catch(errors.standard(res));
  },

  /** Delete a session
   * @body token
   */
  delete: (req, res) => {
    Session.findOneAndDelete({
      token: req.body.token,
    }).then((deletedSession) => {
      errors.inline.badToken(deletedSession);
      res.status(200).json({ message: 'Successfully logged out' });
    }).catch(errors.standard(res));
  },
};