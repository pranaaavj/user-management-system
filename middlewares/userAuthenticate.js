const { getUser, setUser } = require('../service/userAuth');

function AuthenticateUser(req, res, next) {
  const sessionId = req.cookies.uid;
  const user = getUser(sessionId);
  req.user = user;
  next();
}

module.exports = {
  AuthenticateUser,
};
