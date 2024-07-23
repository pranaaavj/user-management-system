async function adminAuthorization(req, res) {
  const { user } = req.user;
  if (user) {
    next()
  } else {
    return res.redirect('')
  }
}