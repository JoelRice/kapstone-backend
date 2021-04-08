module.exports = {
  account: {
    /** 201/Account created
     */
    created: (req, res) => {
      res.status(201).json({
        message: 'Account successfully created',
      });
    },
    /** 200/Account deleted
     */
    deleted: (req, res) => {
      res.status(200).json({
        message: 'Account successfully deleted',
      });
    },
  },
  session: {  
    /** 201/Logged in
     * @reqLocal session
     */
    created: (req, res) => {
      res.status(201).json({
        message: 'Successfully logged in',
        token: res.locals.session.token,
      });
    },
    /** 200/Logged out
     */
    deleted: (req, res) => {
      res.status(200).json({
        message: 'Successfully logged out',
      });
    },
  },
};