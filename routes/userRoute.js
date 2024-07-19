const express = require('express');
const router = express.Router();

const {
  handlerUserLogin,
  renderLogin,
  renderSignup,
  handlerSignUp,
  renderHomePage,
  handlerUserLogout,
} = require('../controller/userController');

router.route('/').get(renderHomePage);
router.route('/login').get(renderLogin).post(handlerUserLogin);
router.route('/signup').get(renderSignup).post(handlerSignUp);

router.get('/logout', handlerUserLogout);

router.get('/tryout', (req, res) => {
  res.render('adminPanel.ejs');
});
module.exports = router;
