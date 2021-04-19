const Auction = require('../models/Auction');

// Lets us call call controllers and observe the output
const callController = (params, body, middleware) => {
  const req = {
    params: params,
    body: body,
  };
  const res = {
    statusCode: 200,
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: (obj) => {
      console.log(obj.message || obj.error);
    },
  };
  res.status.bind(res);
  middleware(req, res);
};

const schedule = (type, object) => {  
  const futureDate = extractDate(type, object);
  const now = new Date().getTime();

  const onTimeout = () => events[type](object._id);
  if (futureDate.getTime() > now) {
    setTimeout(onTimeout, futureDate.getTime() - now);
    console.log(`Scheduled: ${type} event (${object._id}) for ${futureDate}`);
  }
  else {
    console.log(`Overdue: ${type} event (${object._id}) running now`);
    onTimeout();
  }
};

// Could have other things that can timeout
// Just auction for now though

// This pulls out the right property for the timeout date
const extractDate = (type, object) => ({
  auction: object.endsAt,
}[type]);

// This has the event callbacks to run by event type
const events = {
  auction: (id) => {
    // Inline require to avoid circular dependencies
    callController({ id: id }, {}, require('../controllers/auctions').delete);
  },
};

// Run when the server initializes to schedule all events
const init = () => {
  Auction.find().then((foundAuctions) => {
    foundAuctions.forEach((auction) => {
      schedule('auction', auction);
    });
  });
};

module.exports = { schedule, init };