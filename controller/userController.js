const User = require('../models/userModel');

function renderHomePage(req, res) {
  const user = req.user;
  //checking for cookie
  if (!user) {
    return res.redirect('/api/v1/login');
  }
  return res.render('home.ejs');
}

function renderLogin(req, res) {
  const user = req.user;
  //checking for cookie
  if (!user) {
    return res.render('loginPage.ejs');
  }
  res.redirect('/api/v1/');
}

function renderSignup(req, res) {
  res.render('signupPage.ejs');
}

async function handlerUserLogin(req, res, next) {
  const { password, email } = req.body;
  //checking for empty fields
  if ((!password, !email)) {
    return res.render('loginPage.ejs', { msg: 'Fields Cannot be Empty' });
  }
  //checking user in db
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.render('loginPage.ejs', { msg: 'No User Found, Please Signup' });
  }
  //checking password
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    return res.render('loginPage.ejs', { msg: 'Incorrect Password' });
  }
  //attaching cookie
  const token = user.createJwt();
  res.cookie('jwt', token);
  // console.log(res.cookie);
  return res.redirect('/api/v1/');
}

async function handlerSignUp(req, res) {
  const { firstName, lastName, email, password } = req.body;
  //checking for empty fields
  if (!firstName || !lastName || !email || !password) {
    return res.render('signupPage.ejs', { msg: 'Feilds Cannot Be Empty !!' });
  }
  //checking for existing user
  const user = await User.find({
    email,
  });
  try {
    //creating user
    if (user.length == 0) {
      await User.create({
        firstName,
        lastName,
        email,
        password,
      });
      return res.redirect('/api/v1/login');
    }
    //error if user already exists
    return res.render('signupPage.ejs', { msg: 'User Already Exists' });
  } catch (error) {
    const customError = {};
    //throwing custom error
    customError.msg = Object.values(error.errors)
      .map((err) => {
        return err.message;
      })
      .join(',');
    return res.render('signupPage.ejs', { msg: customError.msg });
  }
}

function handlerUserLogout(req, res) {
  //clearing cookie while logout
  res.clearCookie('jwt');
  return res.redirect('/api/v1/login');
}

module.exports = {
  renderLogin,
  renderSignup,
  handlerUserLogin,
  handlerSignUp,
  renderHomePage,
  handlerUserLogout,
};
