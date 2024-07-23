const express = require('express');
const router = express.Router();
const {
  renderAdminLogin,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
  renderNewUserSignup,
} = require('../controller/adminController');

router.route('/login').get(renderAdminLogin).post(handlerAdminLogin);
// router.get('/users', handlerAllUsers);
router.route('/users').get(handlerAllUsers).post(handlerCreateUser);

router.get('/users/create', renderNewUserSignup);

router.get('/tryout', (req, res) => {
  res.render('tryout.ejs');
});

router.post('/users/:id', handlerDeleteUser);
// router.post('/users', handlerCreateUser);?

module.exports = router;
