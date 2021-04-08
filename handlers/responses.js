module.exports = {
  account: {
    created: (req, res) => {
      res.status(201).json({
        message: 'Account successfully created',
      });
    },
    deleted: (req, res) => {
      res.status(200).json({
        message: 'Account successfully deleted',
      });
    },
  },
  session: {
    created: (req, res) => {
      res.status(201).json({
        message: 'Successfully logged in',
        token: res.locals.session.token,
      });
    },
    deleted: (req, res) => {
      res.status(200).json({
        message: 'Successfully logged out',
      });
    },
  },
};