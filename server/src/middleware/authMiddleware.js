const passport = require('../config/passport-config');

module.exports = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    req.user = user;
    next();
  })(req, res, next);
};
