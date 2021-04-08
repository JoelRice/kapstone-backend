class ErrorChain {
  constructor(err, res) {
    this.err = err;
    this.res = res;
    this.done = false;
  }

  /** 409/param when a duplicate is detected
   */
  dupe(message='That already exists') {
    if (!this.done && typeof this.err === 'object' && this.err.code === 11000) {
      this.res.status(409).json({ error: message });
      this.done = true;
    }    
    return this;
  }

  /** 400/Unknown database error
   */
  database() {
    if (!this.done && typeof this.err === 'object') {
      this.res.status(400).json({ error: 'An unknown database error ocurred' });
      console.log(this.err);
      this.done = true;
    }
    return this;
  }

  /** 400/err
   */
  standard() {
    if (!this.done && this.err) {
      this.res.status(400).json({ error: this.err });
      this.done = true;
    }
    return this;
  }
}

module.exports = ErrorChain;