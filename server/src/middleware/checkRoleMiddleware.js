const jwt = require('jsonwebtoken');

module.exports = function (role) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') {
      return next();
    }
    try {
      let token;
      // 2. Если нет - ищем в куке
      if (!token && req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
      }
      if (!token) {
        return res.status(401).json({ message: 'Не авторизован' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      if (decoded.role !== role) {
        return res.status(403).json({ message: 'У вас нет доступа' });
      }
      req.user = decoded;
      next();
    } catch (e) {
      res.status(401).json({ message: 'Не авторизован', error: e });
    }
  };
};
