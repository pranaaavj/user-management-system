const User = require('../models/userModel');

async function renderAdminLogin(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.render('adminLogin.ejs');
  }
  res.redirect('/api/v1/admin/users');
}

async function handlerAdminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render('adminLogin.ejs', { msg: 'Fields cannot be empty' });
  }
  try {
    const admin = await User.findOne({ email });
    //checking for empty fields
    if (!admin) {
      return res.render('adminLogin.ejs', { msg: 'Admin Not Found' });
    }
    //checking password
    const isPassword = await admin.comparePassword(password);
    if (!isPassword && admin) {
      return res.render('adminLogin.ejs', { msg: 'Incorrect Password' });
    }
    //checking admin authorization
    if (!admin.isAdmin) {
      return res.render('adminLogin.ejs', { msg: 'Not Authorized' });
    }
    const token = admin.createJwt();
    res.cookie('jwt', token);

    res.redirect('/api/v1/admin/users');
  } catch (error) {
    res.render('adminLogin.ejs', { msg: error });
  }
}

async function handlerAllUsers(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.redirect('/api/v1/admin/login');
  }
  const AllUser = await User.find({});
  res.render('adminPanel.ejs', { users: AllUser });
}

async function handlerDeleteUser(req, res) {
  const { id: userId } = req.params;
  try {
    //finding user to delete
    await User.deleteOne({ _id: userId });
    const AllUser = await User.find({});
    res.render('adminPanel.ejs', { users: AllUser });
  } catch (error) {
    res.render('adminPanel.ejs', { msg: 'Error occured while deleting user' });
  }
}

async function renderNewUserSignup(req, res) {
  const user = req.user;
  if (!user?.isAdmin) {
    return res.redirect('/api/v1/admin/login');
  }
  res.render('newUserPage.ejs');
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

function handlerAdminLogout(req, res) {
  //clearing cookie while logging out
  res.clearCookie('jwt');
  res.redirect('/api/v1/admin/login');
}

module.exports = {
  renderAdminLogin,
  renderNewUserSignup,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
  handlerAdminLogout,
};
