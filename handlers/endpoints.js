const router = require('express').Router();

const check = require('./validators');

const users = require('../controllers/users');
const sessions = require('../controllers/sessions');
const auctions = require('../controllers/auctions');
const pets = require('../controllers/pets');
const products = require('../controllers/products');

const tokenGen = require('../tokenGenerator');

// Validators read 'req.body' to check
// its formatting and provide useful errors.
// Then the request gets passed on to the CRUD controller

router.route('/auth/account')
  // Get info about your account
  .get(
    check.body('token'),
    sessions.read,
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

router.route('/admin/product')
  // Create a new product in the store
  .post(
    check.body('token'),
    check.body('name'),
    check.body('pictureData'),
    check.body('quality', 'amount'),
    check.body('category', 'productCategory'),
    check.body('price', 'amount'),
    products.createType,
  );

router.route('/admin/pet')
  // Create a new pet
  .post(
    check.body('token'),
    check.body('name'),
    check.body('pictureData'),
    check.body('traits'),
    check.body('stats'),
    pets.create,
  );

router.route('/auctions')
  .get(
    auctions.all,
  )
  .post(
    check.body('token'),
    check.body('pet', 'mongoId'),
    check.body('endsAt', 'date'),
    auctions.create,
  );

router.route('/auctions/:id')
  // Get all the info on an auction
  .get(
    check.params('id', 'mongoId'),
    auctions.read,
  )
  // Place a bid on an auction
  .post(
    check.params('id', 'mongoId'),
    check.body('token'),
    check.body('amount'),
    auctions.update,
  );

router.route('/pets')
  .get(
    pets.all,
  );

router.route('/pets/:id')
  .get(
    check.params('id', 'mongoId'),
    pets.read,
  );

router.route('/users')
  .get(
    users.all,
  );

router.route('/users/:id')
  .get(
    check.params('id', 'mongoId'),
    users.read,
  );

router.route('/products')
  .get(
    check.optional('').query('filter', 'productCategory'),
    check.optional('quality').query('sort', 'productSort'),
    check.optional('asc').query('order'),
    products.all,
  );

router.route('/products:name')
  .get(
    check.params('name', 'productName'),
    products.read,
  )
  .post(
    check.params('name', 'productName'),
    check.body('token'),
    check.body('quantity', 'amount'),
    products.create,
  );

module.exports = router;