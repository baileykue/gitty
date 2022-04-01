const { verify } = require('../utils/jwt');

module.exports = (req, res, next) => {
  try {
    const cookie = req.cookies[process.env.COOKIE_NAME];
    req.user = verify(cookie);

    next();
  } catch (error) {
    error.message = 'You must be signed in to continue.';
    error.status = 401;
    next(error);
  }
};
