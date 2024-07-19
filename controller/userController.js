const User = require('../models/userModel');
const { getUser, setUser } = require('../service/userAuth');
const { v4: uuidv4 } = require('uuid');

function renderHomePage(req, res) {
  const user = req.user;
  if (!user) {
    return res.redirect('/login');
  }
  return res.render('home.ejs');
}

function renderLogin(req, res) {
  const user = req.user;
  if (!user) {
    return res.render('loginPage.ejs');
  }
  res.redirect('/');
}

function renderSignup(req, res) {
  res.render('signupPage.ejs');
}

async function handlerUserLogin(req, res) {
  const { password, email } = req.body;
  const user = await User.findOne({
    email,
    password,
  });
  if (!user) {
    return res.render('loginPage.ejs', { msg: 'Invalid Credentials !!' });
  }

  const sessionId = uuidv4();
  setUser(sessionId, user);
  res.cookie('uid', sessionId);

  return res.redirect('/');
}

async function handlerSignUp(req, res) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.render('signupPage.ejs', { msg: 'Feilds Cannot Be Empty !!' });
  }

  const user = await User.find({
    email,
  });

  if (user.length == 0) {
    await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    return res.redirect('/login');
  }

  res.render('signupPage.ejs', { msg: 'User Already Exists' });
}

function handlerUserLogout(req, res) {
  res.clearCookie('uid');
  return res.redirect('/login');
}

module.exports = {
  renderLogin,
  renderSignup,
  handlerUserLogin,
  handlerSignUp,
  renderHomePage,
  handlerUserLogout,
};
