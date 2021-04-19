const { json } = require('express');
const errors = require('../handlers/errors');

const Pet = require('../models/Pet');
const Product = require('../models/Product');
const Session = require('../models/Session');
const User = require('../models/User');

const { randInt, categoryToTiredChange, categoryToTrait, activityMessage, calcTiredFactor } = require('../tools');

module.exports = {
  /** Get all pet ids
  */
  all: (req, res) => {
    Pet.find().then((foundPets) => {
      res.status(200).json(foundPets.map((pet) => pet._id));
    }).catch(errors.standard(res));
  },
  /** Read a pet
   * @params id
   */
  read: (req, res) => {
    Pet.findById(req.params.id).then((foundPet) => {
      errors.inline.badResource(foundPet);
      res.status(200).json({
        name: foundPet.name,
        pictureData: foundPet.pictureData,
        owner: foundPet.owner,
        traits: {
          cuddly: foundPet.traits.cuddly,
          lazy: foundPet.traits.lazy,
          hungry: foundPet.traits.hungry,
          playful: foundPet.traits.playful,
          loyal: foundPet.traits.loyal,
        },
        stats: {
          tired: foundPet.stats.tired,
          trusting: foundPet.stats.trusting,
        },
      });
    }).catch(errors.standard(res));
  },

  /** Create a new pet
   * @body token
   * @body name
   * @body pictureData
   * @body traits
   * @body stats
   */
  create: (req, res) => {
    Session.findOne({
      token: req.body.token,
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badPermission(foundUser);
      return Pet.create({
        name: req.body.name,
        pictureData: req.body.pictureData,
        traits: {
          cuddly: req.body.cuddly,
          lazy: req.body.lazy,
          hungry: req.body.hungry,
          playful: req.body.playful,
          loyal: req.body.loyal,
        },
        stats: {
          tired: 1,
          trusting: 1,
        },
      });
    }).then((createdPet) => {
      res.status(201).json({
        message: 'Pet successfully created',
        pet: createdPet._id,
      });
    }).catch(errors.standard(res));
  },
  /** Interact with a pet, using an item
   * @body token
   * @body pet
   * @body product
   */
  interact: (req, res) => {
    let user = null;
    let pet = null;
    let product = null;
    let amount = 0;
    Session.findOne({
      token: req.body.token,
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badProduct(foundUser, req.body.product);
      user = foundUser;
      return Pet.findById(req.body.pet);
    }).then((foundPet) => {
      errors.inline.badOwner(user, foundPet);
      pet = foundPet;
      return Product.findOne({ name: req.body.product });
    }).then((foundProduct) => {
      errors.inline.badResource(foundProduct);
      product = foundProduct;

      amount = product.quality
        * pet.traits[categoryToTrait(product.category)]
        * pet.stats.trusting
        * calcTiredFactor(product.category, pet.stats.tired);
      amount = randInt(amount, amount * 2);
      user.balance += amount;
      user.inventory.splice(user.inventory.findIndex((p) => p.name === product.name), 1);

      pet.stats.trusting = Math.min(pet.stats.trusting + 1, pet.traits.loyal);
      pet.stats.tired += categoryToTiredChange(product.category);

      
      return pet.save();
    }).then((updatedPet) => {
      return user.save();
    }).then((updatedUser) => {
      res.status(200).json({ message: activityMessage(pet.name, product.category, product.name, amount) });
    }).catch(errors.standard(res));
  },
};