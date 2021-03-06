const errors = require('../handlers/errors');

const User = require('../models/User');
const Pet = require('../models/Pet');
const Session = require('../models/Session');

module.exports = {
  /** Read a user
   * @param id
   */
  read: (req, res) => {
    let user = null;
    User.findById(req.params.id).then((foundUser) => {
      errors.inline.badResource(foundUser);
      user = foundUser;
      return Pet.find({
        owner: foundUser._id,
      });
    }).then((foundPets) => {
      if (user.isAdmin) {
        res.status(200).json({ username: user.username });
        return;
      }
      res.status(200).json({
        username: user.username,
        balance: user.balance,
        pets: foundPets.map((pet) => pet._id),
      });
    }).catch(errors.standard(res));
  },
  /** Get all users ids
   */
  all: (req, res) => {
    User.find().then((foundUsers) => {
      res.status(200).json(foundUsers.map((user) => user._id));
    }).catch(errors.standard(res));
  },
  /** Create a user
   * @body username
   * @body password
   */
  create: (req, res) => {
    User.create({
      username: req.body.username,
      password: req.body.password,
      isAdmin: false,
      balance: 500,
    }).then((createdUser) => {
      res.status(201).json({ message: 'Account successfully created' });
    }).catch(errors.dupes(res, 'That username is already taken'));
  },

  /** Update a user
   * @body token
   * @body password
   * @body newUsername
   * @body newPassword
   */
  update: (req, res) => {
    Session.findOne({
      token: req.headers.authorization.split(' ')[1],
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badPassword(foundUser, req.body.password);
      return User.findByIdAndUpdate(foundUser._id, {
        username: req.body.newUsername,
        password: req.body.newPassword,
      });
    }).then((updatedUser) => {
      res.status(200).json({ message: 'Account successfully updated' });
    }).catch(errors.dupes(res, 'That username is already taken'));
  },

  /** Delete a user
   * @body token
   * @body password
   */
  delete: (req, res) => {
    Session.findOne({
      token: req.headers.authorization.split(' ')[1],
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badPassword(foundUser, req.body.password);
      return User.findByIdAndDelete(foundUser._id);
    }).then((deletedUser) => {
      res.status(200).json({ message: 'Account successfully deleted' });
    }).catch(errors.standard(res));
  },
};