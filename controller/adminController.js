const User = require('../models/userModel');

async function renderAdminLogin(req, res) {
  res.render('adminLogin.ejs');
}

async function handlerAdminLogin(req, res) {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });

  const isPassword = await admin.comparePassword(password);
  if (!isPassword) {
    return res.render('adminLogin.ejs', { msg: 'Incorrect Password' });
  }

  res.redirect('/api/v1/admin/users');
}

async function handlerAllUsers(req, res) {
  const AllUser = await User.find({});
  res.render('adminPanel.ejs', { users: AllUser });
}

async function handlerDeleteUser(req, res) {
  const { id: userId } = req.params;
  try {
    await User.deleteOne({ _id: userId });
    const AllUser = await User.find({});
    res.render('adminPanel.ejs', { users: AllUser });
  } catch (error) {
    res.render('adminPanel.ejs', { msg: 'Error occured while deleting user' });
  }
}

async function handlerCreateUser(req, res) {
  const { firstName, lastName, email, password, isAdmin } = req.body;
}

module.exports = {
  handlerAdminLogin,
  renderAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
};
