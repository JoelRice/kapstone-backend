class ErrorChain {
  constructor(err, res) {
    this.err = err;
    this.res = res;
    this.done = false;
  }

  /** 409/param when a duplicate is detected
   */
  databaseDupe(message='That already exists') {
    if (!this.done && this.err instanceof Object && this.err.code === 11000) {
      this.res.status(409).json({ error: message });
      this.done = true;
    }    
    return this;
  }

  /** 400/Unknown database error
   */
  database() {
    if (!this.done && this.err instanceof Object) {
      this.res.status(400).json({ error: 'An unknown database error ocurred' });
      console.log(this.err);
      this.done = true;
    }
    return this;
  }

  /** status/err
   */
  customStatus() {
    if (!this.done && this.err instanceof Array) {
      this.res.status(this.err[0]).json({ error: this.err[1] });
      this.done = true;
    }
    return this;
  }

  /** 400/err
   */
  defaultStatus() {
    if (!this.done && this.err instanceof String) {
      this.res.status(400).json({ error: this.err });
      this.done = true;
    }
    return this;
  }
}

module.exports = {
  standard: (res) => (err) => {
    new ErrorChain(err, res).customStatus().defaultStatus().database();
  },
  dupes: (res, message) => (err) => {
    new ErrorChain(err, res).customStatus().defaultStatus().databaseDupe(message).database();
  },
  inline: {
    badToken: (session) => {
      if (session === null) throw [400, 'Invalid token'];
    },
    badPassword: (user, password) => {
      if (user === null || user.password !== password) throw [400, 'Incorrect password'];
    },
    badCredentials: (user) => {
      if (user === null) throw [400, 'Incorrect username or password'];
    },
  },
};