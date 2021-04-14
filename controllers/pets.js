const errors = require('../handlers/errors');

const Pet = require('../models/Pet');

module.exports = {
  /** Get all pet ids
  */
  all: (req, res) => {
    Pet.find().then((foundPets) => {
      res.status(200).json(foundPets.map((pet) => pet._id));
    }).catch(errors.standard(res));
  },
  /** Read a pet
   * @param id
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
          energetic: foundPet.traits.energetic,
          loyal: foundPet.traits.loyal,
        },
        stats: {
          tired: foundPet.stats.tired,
          trusting: foundPet.stats.trusting,
        },
      });
    }).catch(errors.standard(res));
  },
};