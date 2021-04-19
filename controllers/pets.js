const errors = require('../handlers/errors');

const Pet = require('../models/Pet');
const Session = require('../models/Session');
const User = require('../models/User');

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
};