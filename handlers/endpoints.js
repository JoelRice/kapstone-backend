const router = require('express').Router();

const user = require('../controllers/user');
const session = require('../controllers/session');

const responses = require('./responses');
const check = require('./validators');

// Each endpoint calls
// One or more validators
// One or more controllers
// then finally a response handler

// Validators read 'req.body' to check
// its formatting and provide useful
// errors.

// Controllers create properties on 'res.locals'

// Response handlers use those properties to output
// the response body and a message

router.route('/auth/account')
  // Create a new account
  .post(
    // check.username,
    // check.password,
    user.create,
    responses.account.created,
  )
  // Delete your session token and its account
  .delete(
    // check.token,
    // check.password,
    user.deleteByToken,
    session.deleteByToken,
    responses.account.deleted,
  );

router.route('/auth/login')
  // Log in to your account, creating a session token
  .post(
    // check.username,
    // check.password,
    session.create,
    responses.session.created,
  );

router.route('/auth/logout')
  // Log out of your account, deleting your session token
  .post(
    // check.token,
    session.deleteByToken,
    responses.session.deleted,
  );

module.exports = router;