const MAX = 2176782335; // zzzzzz in base36

const jumble = (x) => Math.floor(MAX * x * (Math.sin(x) + 1)) % MAX;

const tokenFromTime = () => jumble((new Date()).getTime()).toString(36).padStart(6, '0');

const tokenGenerator = {
  prev: '',
  next: () => {
    let token = tokenFromTime();
    while (token === this.prev) {
      token = tokenFromTime();
    }
    this.prev = token;
    return token;
  },
};

module.exports = tokenGenerator;