const express = require('express');
const router = express.Router();
const {
  renderAdminLogin,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
} = require('../controller/adminController');

router.route('/login').get(renderAdminLogin).post(handlerAdminLogin);
router.get('/users', handlerAllUsers);

router.get('/tryout', (req, res) => {
  res.render('tryout.ejs');
});

router.post('/users/:id', handlerDeleteUser);
router.post('/users', handlerCreateUser);

module.exports = router;
