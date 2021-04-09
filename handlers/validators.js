const exists = (req, prop) => Object.hasOwnProperty.call(req.body, prop);

module.exports = {
  /** Check token exists and is in the right format
   * @body token
   */
  token: (req, res, next) => {
    if (!exists(req, 'token')) {
      res.status(400).json({ error: 'Request body.token was not provided' });
      return;
    }
    // 6 chars long using only lowercase and numbers: base36
    if (!/^[a-z0-9]{6}$/.test(req.body.token)) {
      res.status(400).json({ error: 'Request body.token is malformed' });
      return;
    }
    next();
  },
  /** Check username exists and is in the right format
   * @body username
   */
  username: (req, res, next) => {
    if (!exists(req, 'username')) {
      res.status(400).json({ error: 'Request body.username was not provided' });
      return;
    }
    // Length check
    if (req.body.username.length < 3 || req.body.username.length > 32) {
      res.status(400).json({ error: 'Username must be between 3 and 32 characters long' });
      return;
    }
    // ASCII check
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      res.status(400).json({ error: 'Username may only contain numbers and letters' });
      return;
    }
    next();
  },
  /** Check password exists and is in the right format
   * @body password
   */
  password: (req, res, next) => {
    if (!exists(req, 'password')) {
      res.status(400).json({ error: 'Request body.password was not provided' });
      return;
    }
    // Length check
    if (req.body.password.length < 3 || req.body.password.length > 32) {
      res.status(400).json({ error: 'Password must be between 3 and 32 characters long' });
      return;
    }
    // ASCII + symbols check
    if (!/^[a-zA-Z0-9~`!@#$%^&*()_+{}|[\]\\:";'<>?,./]+$/.test(req.body.password)) {
      res.status(400).json({ error: 'Password may only contain numbers, letters, and regular symbols' });
      return;
    }
    next();
  },
};
