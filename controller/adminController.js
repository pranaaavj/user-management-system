const { query } = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
//GET Login
async function renderAdminLogin(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.status(200).render('adminLogin.ejs');
  }
  res.status(200).redirect('/api/v1/admin/users');
}
//POST Login
async function handlerAdminLogin(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .render('adminLogin.ejs', { msg: 'Fields cannot be empty' });
  }
  try {
    const admin = await User.findOne({ email });
    //checking for empty fields
    if (!admin) {
      return res
        .status(400)
        .render('adminLogin.ejs', { msg: 'Admin Not Found' });
    }
    //checking password
    const isPassword = await admin.comparePassword(password);
    if (!isPassword && admin) {
      return res
        .status(400)
        .render('adminLogin.ejs', { msg: 'Incorrect Password' });
    }
    //checking admin authorization
    if (!admin.isAdmin) {
      return res
        .status(401)
        .render('adminLogin.ejs', { msg: 'Not Authorized' });
    }
    const token = admin.createJwt();
    res.cookie('jwt', token);

    res.status(202).redirect('/api/v1/admin/users');
  } catch (error) {
    res.status(500).render('adminLogin.ejs', { msg: error });
  }
}
//GET Admin Dashboard
async function handlerAllUsers(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.status(401).redirect('/api/v1/admin/login');
  }
  //grabbing the search query from search bar
  const regex = req.query.search;
  if (regex) {
    const users = await User.find({
      firstName: { $regex: regex, $options: 'i' },
    });

    if (users.length < 1) {
      return res.status(404).render('adminPanel.ejs', {
        msg: 'No user found',
      });
    }
    return res.status(200).render('adminPanel.ejs', { users: users });
  }
  //dynamically rendering all users
  const AllUser = await User.find({});
  res.status(200).render('adminPanel.ejs', { users: AllUser });
}
//DELETE User
async function handlerDeleteUser(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.status(401).redirect('/api/v1/admin/login');
  }
  const { id: userId } = req.params;
  try {
    //finding user to delete
    await User.deleteOne({ _id: userId });
    const AllUser = await User.find({});
    res.status(200).render('adminPanel.ejs', { users: AllUser });
  } catch (error) {
    res
      .status(500)
      .render('adminPanel.ejs', { msg: 'Error occured while deleting user' });
  }
}
//POST Edit User
async function renderEditUserPage(req, res) {
  //checking if user is logged in
  const user = req.user;
  const {
    params: { id },
  } = req;
  try {
    if (!user?.isAdmin) {
      return res.status(401).redirect('/api/v1/admin/login');
    }
    //sending user details to ejs
    const oldUser = await User.findById({ _id: id });
    return res.status(200).render('editUserPage.ejs', {
      id: id,
      msg: '',
      users: [oldUser],
    });
  } catch (error) {
    return res
      .status(500)
      .render('editUserPage.ejs', { msg: 'An error Occured' });
  }
}
//PATCH User
async function handlerEditUser(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.status(401).redirect('/api/v1/admin/login');
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
    res.status(500).render('editUserPage.ejs', { msg: 'An error occured' });
  }
}
//GET New User
async function renderNewUserSignup(req, res) {
  //checking if user is logged in
  const user = req.user;
  if (!user?.isAdmin) {
    return res.status(401).redirect('/api/v1/admin/login');
  }
  res.status(200).render('newUserPage.ejs');
}
//POST New User
async function handlerCreateUser(req, res) {
  const { firstName, lastName, email, password, isAdmin } = req.body;
  //check for empty fields
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .render('newUserPage.ejs', { msg: 'Fields cannot be empty' });
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
      return res.status(201).redirect('/api/v1/admin/users');
    }
    return res
      .status(409)
      .render('newUserPage.ejs', { msg: 'User Already Exists' });
  } catch (error) {
    //throwing custom error message
    const customError = {};
    if (error.name == 'ValidationError') {
      customError.msg = Object.values(error.errors)
        .map((err) => err.message)
        .join(',');
    }

    res.status(500).render('newUserPage.ejs', { msg: customError.msg });
  }
}
//GET Logout
function handlerAdminLogout(req, res) {
  //clearing cookie while logging out
  res.status(200).clearCookie('jwt');
  res.status(200).redirect('/api/v1/admin/login');
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
