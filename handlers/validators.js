const exists = (obj, prop) => Object.hasOwnProperty.call(obj, prop);

const validators = {
  token: (res, next, body, key) => {
    if (!exists(body, key)) {
      res.status(400).json({ error: `Request body.${key} was not provided` });
      return;
    }
    // 6 chars long using only lowercase and numbers: base36
    if (!/^[a-z0-9]{6}$/.test(body[key])) {
      res.status(400).json({ error: `Request body.${key} is malformed` });
      return;
    }
    next();
  },
  username: (res, next, body, key) => {
    if (!exists(body, key)) {
      res.status(400).json({ error: `Request body.${key} was not provided` });
      return;
    }
    // Length check
    if (body[key].length < 3 || body[key].length > 32) {
      res.status(400).json({ error: 'Usernames must be between 3 and 32 characters long' });
      return;
    }
    // ASCII check
    if (!/^[a-zA-Z0-9]+$/.test(body[key])) {
      res.status(400).json({ error: 'Usernames may only contain numbers and letters' });
      return;
    }
    next();
  },
  password: (res, next, body, key) => {
    if (!exists(body, key)) {
      res.status(400).json({ error: `Request body.${key} was not provided` });
      return;
    }
    // Length check
    if (body[key].length < 3 || body[key].length > 32) {
      res.status(400).json({ error: 'Passwords must be between 3 and 32 characters long' });
      return;
    }
    // ASCII + symbols check
    if (!/^[a-zA-Z0-9~`!@#$%^&*()_+{}|[\]\\:";'<>?,./]+$/.test(body[key])) {
      res.status(400).json({ error: 'Passwords may only contain numbers, letters, and standard symbols' });
      return;
    }
    next();
  },
};

module.exports = {
  body: (key, type=key) => (
    (req, res, next) => {
      validators[type](res, next, req.body, key);
    }
  ),
};