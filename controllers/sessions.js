const errors = require('../handlers/errors');

const User = require('../models/User');
const Session = require('../models/Session');
const Pet = require('../models/Pet');

const tokenGen = require('../tokenGenerator');

module.exports = {
  /** Read a user via session
   * @body token
   */
  read: (req, res) => {
    let user = null;
    Session.findOne({
      token: req.headers.authorization.split(' ')[1],
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      user = {
        username: foundUser.foundUsername,
        balance: foundUser.balance,
        isAdmin: foundUser.isAdmin,
        inventory: foundUser.inventory.map((item) => item.name),
      };
      return Pet.find({ owner: foundUser._id });
    }).then((foundPets) => {
      user.pets = foundPets.map((pet) => pet._id);
      res.status(200).json(user);
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
      token: req.headers.authorization.split(' ')[1],
    }).then((deletedSession) => {
      errors.inline.badToken(deletedSession);
      res.status(200).json({ message: 'Successfully logged out' });
    }).catch(errors.standard(res));
  },
};