module.exports = {
  /** Process errors to output error messages
   * @param {Any} err Error from .catch()
   * @param {Any} res Express result object
   * @param {<Array, Function>} errorFuncs Ex: errors.standard OR [errors.standard, 'An output message']
   */
  process: (err, res, ...errorFuncs) => {
    for (let af of errorFuncs) {
      if (af instanceof Array) {
        if (af[0](err, res, ...af.slice(1))) return;
      }
      else {
        if (af(err, res)) return;
      }
    }
  },
  dupe: (err, res, onDuplicate='That already exists') => {
    if (typeof err === 'object' && err.code === 11000) {
      res.status(409).json({ error: onDuplicate });
      return true;
    }    
    return false;
  },
  database: (err, res) => {
    if (typeof err === 'object') {
      res.status(400).json({ error: 'An unknown database error ocurred' });
      console.log(err);
    }
    return false;
  },
  standard: (err, res) => {
    if (err) {
      res.status(400).json({ error: err });
      return true;
    }
    return false;
  },
};