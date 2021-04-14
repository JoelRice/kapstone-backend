const router = require('express').Router();

const check = require('./validators');

const users = require('../controllers/users');
const sessions = require('../controllers/sessions');

const tokenGen = require('../tokenGenerator');

// Validators read 'req.body' to check
// its formatting and provide useful errors.
// Then the request gets passed on to the CRUD controller

router.route('/auth/account')
  // Get info about your account
  .get(
    check.body('token'),
    users.read,
  )
  // Create a new account
  .post(
    check.body('username'),
    check.body('password'),
    users.create,
  )
  // Update your account
  .put(
    check.body('token'),
    check.body('password'),
    check.body('newUsername', 'username'),
    check.body('newPassword', 'password'),
    users.update,
  )
  // Delete your account
  .delete(
    check.body('token'),
    check.body('password'),
    users.delete,
  );

router.route('/auth/login')
  // Log in to your account, creating a session token
  .post(
    check.body('username'),
    check.body('password'),
    sessions.create,
  );

router.route('/auth/logout')
  // Log out of your account, deleting your session token
  .post(
    check.body('token'),
    sessions.delete,
  );

module.exports = router;