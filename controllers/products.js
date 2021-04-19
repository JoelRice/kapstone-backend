const errors = require('../handlers/errors');

const Product = require('../models/Product');
const Session = require('../models/Session');
const User = require('../models/User');

module.exports = {
  /** Get all products, optionally filtering them
   * @query filter - (petting|resting|eating|playing)
   * @query sort - (quality|price)
   * @query order - (asc|ascending|desc|descending)
  */
  all: (req, res) => {
    Product.find(
      req.query.filter === '' ? {} : { category: req.query.filter }
    ).then((foundProducts) => {
      let products = foundProducts;
      const sorter = (sortProp, order) => (a, b) => ( (a[sortProp] - b[sortProp]) * (order === 'asc' ? 1 : -1) );
      products.sort(sorter(req.query.sort, req.query.order));
      res.status(200).json({ products: products.map((product) => product.name) });
    }).catch(errors.standard(res));
  },
  /** Get an individual product by name
   * @params name
   */
  read: (req, res) => {
    Product.findOne({
      name: req.params.name,
    }).then((foundProduct) => {
      errors.inline.badResource(foundProduct);
      res.status(200).json({
        name: foundProduct.name,
        quality: foundProduct.quality,
        price: foundProduct.price,
        category: foundProduct.category,
      });
    }).catch(errors.standard(res));
  },
  /** Buy a quantity of products
   * @params name
   * @body token
   * @body quantity
   */
  create: (req, res) => {
    let product = null;
    Product.findOne({
      name: req.params.name.split('-').map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase()).join(''),
    }).then((foundProduct) => {
      errors.inline.badResource(foundProduct);
      product = foundProduct;
      return Session.find({
        token: req.body.token,
      });
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badBalance(foundUser, product.price * req.body.quantity);
      foundUser.balance -= product.price * req.body.quantity;
      for (let i = 0; i < req.body.quantity; i++) {
        foundUser.inventory.push({
          name: product.name,
          quality: product.quality,
          category: product.category,
        });
      }
      foundUser.save();
    }).then((updatedUser) => {
      res.status(201).json({ message: `Successfully purchased ${req.body.quality}x ${product.name}` });
    }).catch(errors.standard(res));
  },
  /** Make a new product for the store
   * @body token
   * @body name
   * @body pictureData
   * @body quality
   * @body category
   * @body price
   */
  createType: (req, res) => {
    Session.findOne({
      token: req.body.token,
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badPermission(foundUser);
      return Product.create({
        name: req.body.name,
        pictureData: req.body.pictureData,
        quality: req.body.quality,
        category: req.body.category,
        price: req.body.price,        
      });
    }).then((createdProduct) => {
      res.status(201).json({
        message: 'Product successfully created',
        product: createdProduct._id,
      });
    }).catch(errors.dupes(res, 'This product name already exists'));
  },
};