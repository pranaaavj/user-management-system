const jwt = require('jsonwebtoken');
//Checking if user is admin
async function authorizeAdmin(req, res, next) {
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
      res.status(500).redirect('/api/v1/login');
    }
  } else {
    next();
  }
}

module.exports = authorizeAdmin;
