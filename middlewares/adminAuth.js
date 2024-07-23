const jwt = require('jsonwebtoken');

async function authorizeAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
      };
      next();
    } catch (error) {
      console.log(error);
      res.redirect('/api/v1/login');
    }
  } else {
    next();
  }
}

module.exports = authorizeAdmin;
