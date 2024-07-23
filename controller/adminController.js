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

async function renderNewUserSignup(req, res) {
  return res.render('newUserPage.ejs');
}

async function handlerCreateUser(req, res) {
  const { firstName, lastName, email, password, isAdmin } = req.body;
  //check for empty fields
  if (!firstName || !lastName || !email || !password) {
    return res.render('newUserPage.ejs', { msg: 'Fields cannot be empty' });
  }
  //checking for existing user
  const user = await User.find({
    email,
  });

  if (user.length < 1) {
    try {
      //creating new user
      await User.create({
        firstName,
        lastName,
        email,
        password,
        isAdmin,
      });

      res.redirect('/api/v1/admin/users');
    } catch (error) {
      //throwing custom error message
      const customError = {};
      if (error.name == 'ValidationError') {
        customError.msg = Object.values(error.errors)
          .map((err) => err.message)
          .join(',');
      }

      res.render('newUserPage.ejs', { msg: customError.msg });
    }
  }
}

module.exports = {
  handlerAdminLogin,
  renderAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
  renderNewUserSignup,
};
