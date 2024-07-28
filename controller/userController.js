const User = require('../models/userModel');
//GET Home
function renderHomePage(req, res) {
  const user = req.user;
  //checking for cookie
  if (!user) {
    return res.status(401).redirect('/api/v1/login');
  }
  return res.status(200).render('homePage.ejs');
}
//GET login
function renderLogin(req, res) {
  const user = req.user;
  //checking for cookie
  if (!user) {
    return res.status(401).render('loginPage.ejs');
  }
  res.status(200).redirect('/api/v1/');
}
//GET singnup
function renderSignup(req, res) {
  res.status(200).render('signupPage.ejs');
}
//POST login
async function handlerUserLogin(req, res, next) {
  const { password, email } = req.body;
  //checking for empty fields
  if ((!password, !email)) {
    return res
      .status(400)
      .render('loginPage.ejs', { msg: 'Fields Cannot be Empty' });
  }
  //checking user in db
  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res
      .status(404)
      .render('loginPage.ejs', { msg: 'No User Found, Please Signup' });
  }
  //checking password
  const isPassword = await user.comparePassword(password);
  if (!isPassword) {
    return res
      .status(401)
      .render('loginPage.ejs', { msg: 'Incorrect Password' });
  }
  //attaching cookie
  const token = user.createJwt();
  res.cookie('jwt', token);
  // console.log(res.cookie);
  return res.status(200).redirect('/api/v1/');
}
//POST signup
async function handlerSignUp(req, res) {
  const { firstName, lastName, email, password } = req.body;
  //checking for empty fields
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .render('signupPage.ejs', { msg: 'Feilds Cannot Be Empty !!' });
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
      return res.status(201).redirect('/api/v1/login');
    }
    //error if user already exists
    return res
      .status(409)
      .render('signupPage.ejs', { msg: 'User Already Exists' });
  } catch (error) {
    const customError = {};
    //throwing custom error
    customError.msg = Object.values(error.errors)
      .map((err) => {
        return err.message;
      })
      .join(',');
    return res.status(500).render('signupPage.ejs', { msg: customError.msg });
  }
}
//GET logout
function handlerUserLogout(req, res) {
  //clearing cookie while logout
  res.status(200).clearCookie('jwt');
  return res.status(200).redirect('/api/v1/login');
}

module.exports = {
  renderLogin,
  renderSignup,
  handlerUserLogin,
  handlerSignUp,
  renderHomePage,
  handlerUserLogout,
};
