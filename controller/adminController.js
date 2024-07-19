const User = require('../models/userModel');

async function handlerAdminLogin(req, res) {
  const user = req.user;
  const admin = await User.findOne({
    email: user.email,
  });
  if (admin.isAdmin) {
    return res.redirect('admin/users');
  }
  res.redirect('/');
}

async function handlerAllUsers(req, res) {
  const AllUser = await User.find({});
  res.render('adminPanel.ejs', { users: AllUser });
}

module.exports = {
  handlerAdminLogin,
  handlerAllUsers,
};
