const errors = require('../handlers/errors');

const Auction = require('../models/Auction');
const Pet = require('../models/Pet');
const Session = require('../models/Session');
const User = require('../models/User');

module.exports = {
  /** Get all pet ids
  */
  all: (req, res) => {
    Auction.find().then((foundAuctions) => {
      res.status(200).json(foundAuctions.map((auction) => auction._id));
    }).catch(errors.standard(res));
  },
  /** Find all relevant info about an auction
   * @params id
   */
  read: (req, res) => {
    Auction.findById(req.params.id)
      .then((foundAuction) => {
        errors.inline.badResource(foundAuction);
        res.status(200).json({
          pet: foundAuction.pet,
          endsAt: foundAuction.endsAt,
          bids: foundAuction.bids.map((bid) => ({ user: bid.user, amount: bid.amount })),
        });
      }).catch(errors.standard);
  },
  /** Create a new pet and an auction for it
   * @body token
   * @body name
   * @body pictureData
   * @body traits
   * @body stats
   * @body endsAt
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
        traits: req.body.traits,
        stats: req.body.stats,
      });
    }).then((createdPet) => {
      return Auction.create({
        pet: createdPet._id,
        endsAt: new Date(req.body.endsAt),
      });
    }).then((createdAuction) => {
      res.status(201).json({
        message: 'Auction successfully created',
        auction: createdAuction._id,
      });
    }).catch(errors.standard(res));
  },
  /** Add a bid to the auction
   * @params id
   * @body token
   * @body amount
   */
  update: (req, res) => {
    let userId = null;
    Session.findOne({
      token: req.body.token,
    }).then((foundSession) => {
      errors.inline.badToken(foundSession);
      return User.findById(foundSession.user);
    }).then((foundUser) => {
      errors.inline.badBalance(foundUser, req.body.amount);
      foundUser.balance -= req.body.amount;
      return foundUser.save();
    }).then((updatedUser) => {
      userId = updatedUser._id;
      return Auction.findById(req.params.id);
    }).then((foundAuction) => {
      foundAuction.bids.push({
        user: userId,
        amount: req.body.amount
      });
      return foundAuction.save();
    }).then((updatedAuction) => {
      res.status(200).json({ message: 'Bid successfully placed', amount: req.body.amount });
    }).catch(errors.standard(res));
  },
};