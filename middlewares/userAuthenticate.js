const jwt = require('jsonwebtoken');

function userAuthentication(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
        isAdmin: payload.isAdmin,
      };
      next();
    } catch (error) {
      console.log(error);
    }
  } else {
    next();
  }
}

module.exports = userAuthentication;
