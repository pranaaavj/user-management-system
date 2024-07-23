const express = require('express');
const router = express.Router();
const {
  renderAdminLogin,
  renderNewUserSignup,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
  handlerAdminLogout,
} = require('../controller/adminController');

router.route('/login').get(renderAdminLogin).post(handlerAdminLogin);
router.route('/users').get(handlerAllUsers).post(handlerCreateUser);
router
  .get('/users/create', renderNewUserSignup)
  .get('/logout', handlerAdminLogout);
router.post('/users/:id', handlerDeleteUser);

router.get('/tryout', (req, res) => {
  res.render('tryout.ejs');
});

module.exports = router;
