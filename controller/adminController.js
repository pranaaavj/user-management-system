const { query } = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

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
  //grabbing the search query from search bar
  const regex = req.query.search;
  if (regex) {
    const users = await User.find({
      firstName: { $regex: regex, $options: 'i' },
    });

    if (users.length < 1) {
      return res.render('adminPanel.ejs', {
        msg: 'No user found',
      });
    }
    return res.render('adminPanel.ejs', { users: users });
  }
  //dynamically rendering all users
  const AllUser = await User.find({});
  res.render('adminPanel.ejs', { users: AllUser });
}

async function handlerDeleteUser(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.redirect('/api/v1/admin/login');
  }
  const { id: userId } = req.params;
  if (userId == user.userId && user.isSuperAdmin) {
    return res.render('adminPanel.ejs');
  }
  try {
    //finding user to delete
    await User.deleteOne({ _id: userId });
    const AllUser = await User.find({});
    res.render('adminPanel.ejs', { users: AllUser });
  } catch (error) {
    res.render('adminPanel.ejs', { msg: 'Error occured while deleting user' });
  }
}

async function renderEditUserPage(req, res) {
  //checking if user is logged in
  const user = req.user;
  const {
    params: { id },
  } = req;
  try {
    if (!user?.isAdmin) {
      return res.redirect('/api/v1/admin/login');
    }
    //sending user details to ejs
    const oldUser = await User.findById({ _id: id });
    return res.render('editUserPage.ejs', {
      id: id,
      msg: '',
      users: [oldUser],
    });
  } catch (error) {
    return res.render('editUserPage.ejs', { msg: 'An error Occured' });
  }
}

async function handlerEditUser(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.redirect('/api/v1/admin/login');
  }
  const {
    params: { id },
    body,
  } = req;
  try {
    //finding user and updating
    const user = await User.findByIdAndUpdate(
      { _id: id },
      {
        ...body,
        isAdmin: Boolean(body.isAdmin),
      }
    );
    res.status(200).redirect('/api/v1/admin/users');
  } catch (error) {
    res.render('editUserPage.ejs', { msg: 'An error occured' });
  }
}

async function renderNewUserSignup(req, res) {
  //checking if user is logged in
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

  try {
    //creating new user
    if (user.length < 1) {
      await User.create({
        firstName,
        lastName,
        email,
        password,
        isAdmin: Boolean(isAdmin),
      });
      return res.redirect('/api/v1/admin/users');
    }
    return res.render('newUserPage.ejs', { msg: 'User Already Exists' });
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

function handlerAdminLogout(req, res) {
  //clearing cookie while logging out
  res.clearCookie('jwt');
  res.redirect('/api/v1/admin/login');
}

//function to hashPassword
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

module.exports = {
  renderAdminLogin,
  renderNewUserSignup,
  renderEditUserPage,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerEditUser,
  handlerCreateUser,
  handlerAdminLogout,
};
