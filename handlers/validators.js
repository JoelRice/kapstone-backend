
const exists = (obj, prop) => Object.hasOwnProperty.call(obj, prop);

const validators = {
  token: (req, res, source, key) => {
    // 6 chars long using only lowercase and numbers: base36
    if (!/^Basic [a-z0-9]{6}$/.test(req[source][key])) {
      res.status(400).json({ error: `Request ${source}.${key} is malformed` });
      return true;
    }
  },
  username: (req, res, source, key) => {
    // Length check
    if (req[source][key].length < 3 || req[source][key].length > 32) {
      res.status(400).json({ error: 'Usernames must be between 3 and 32 characters long' });
      return true;
    }
    // ASCII check
    if (!/^[a-zA-Z0-9]+$/.test(req[source][key])) {
      res.status(400).json({ error: 'Usernames may only contain numbers and letters' });
      return true;
    }
  },
  name: (req, res, source, key) => {
    // Length check
    if (req[source][key].length < 3 || req[source][key].length > 32) {
      res.status(400).json({ error: 'Names must be between 3 and 32 characters long' });
      return true;
    }
    // Letters check
    if (!/^[a-zA-Z\-' ]+$/.test(req[source][key])) {
      res.status(400).json({ error: 'Names may only contain letters, spaces, hyphens, and apostrophes' });
      return true;
    }
  },
  password: (req, res, source, key) => {
    // Length check
    if (req[source][key].length < 3 || req[source][key].length > 32) {
      res.status(400).json({ error: 'Passwords must be between 3 and 32 characters long' });
      return true;
    }
    // ASCII + symbols check
    if (!/^[a-zA-Z0-9~`!@#$%^&*()_+{}|[\]\\:";'<>?,./]+$/.test(req[source][key])) {
      res.status(400).json({ error: 'Passwords may only contain numbers, letters, and standard symbols' });
      return true;
    }
  },
  pictureData: (req, res, source, key) => {
    // TODO: FIGURE OUT WHAT IT LOOKS LIKE
  },
  date: (req, res, source, key) => {
    if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/.test(req[source][key])| new Date(req[source][key]).toString() === 'Invalid Date') {
      res.status(400).json({ error: `Request ${source}.${key} must be a proper Datestring (Use ISO 8601)` });
      return true;
    }
  },
  mongoId: (req, res, source, key) => {
    // Letters check
    if (!/^[a-z0-9]+$/.test(req[source][key])) {
      res.status(400).json({ error: `Request ${source}.${key} has the wrong format` });
      return true;
    }
  },
  amount: (req, res, source, key) => {
    // Amount check
    if (Number(req[source][key]) < 0 || Number(req[source][key]) % 1 !== 0) {
      res.status(400).json({ error: `${key[0].toUpperCase() + key.slice(1).toLowerCase()} must be whole and positive` });
      return true;
    }
  },
  productCategory: (req, res, source, key) => {
    const options = ['', 'petting', 'resting', 'eating', 'playing'];
    if (!options.includes(req[source][key])) {
      res.status(400).json({ error: `Request ${source}.${key} must be one of (${options.slice(1).join('|')})` });
      return true;
    }
  },
  productSort: (req, res, source, key) => {
    const options = ['quality', 'price'];
    if (!options.includes(req[source][key])) {
      res.status(400).json({ error: `Request ${source}.${key} must be one of (${options.join('|')})` });
      return true;
    }
  },
  productName: (req, res, source, key) => {
    // Letters check
    if (!/^[a-z-]+$/.test(req[source][key])) {
      res.status(400).json({ error: 'Requested product name should match a format like "feather-wand"' });
      return true;
    }
  },
  order: (req, res, source, key) => {
    const options = ['asc', 'desc'];
    if (!options.includes(req[source][key])) {
      res.status(400).json({ error: `Request ${source}.${key} must be one of (${options.join('|')})` });
      return true;
    }
  },
};

const validate = (prop, fallback) => (key, type=key) => {
  if (!exists(validators, type)) {
    throw `Validator not implemented for ${type}`;
  }
  return (req, res, next) => {
    if (!exists(req[prop], key)) {
      if (fallback !== undefined) req[prop][key] = fallback;
      else {
        res.status(400).json({ error: `Request ${prop}.${key} was not provided` });
        return;
      }
    }
    if (validators[type](req, res, prop, key)) return;
    next();
  };
};

module.exports = {
  body: validate('body'),
  params: validate('params'),
  query: validate('query'),
  headers: validate('headers'),
  optional: (fallback) => ({
    body: validate('body', fallback),
    params: validate('params', fallback),
    query: validate('query', fallback),
  })
};