module.exports = {
  account: {
    /** 200/None
     * @locals username
     */
    read: (req, res) => {
      res.status(200).json({
        username: res.locals.user.username,
      });
    },
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
     * @locals session
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