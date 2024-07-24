const express = require('express');
const router = express.Router();
const {
  renderAdminLogin,
  renderNewUserSignup,
  renderEditUserPage,
  handlerAdminLogin,
  handlerAllUsers,
  handlerDeleteUser,
  handlerCreateUser,
  handlerAdminLogout,
  handlerEditUser,
} = require('../controller/adminController');

router.route('/login').get(renderAdminLogin).post(handlerAdminLogin);
router.route('/users').get(handlerAllUsers);
router.route('/users/edit/:id').get(renderEditUserPage).patch(handlerEditUser);
router.route('/users/create').get(renderNewUserSignup).post(handlerCreateUser);
router.delete('/users/delete/:id', handlerDeleteUser);
router.get('/logout', handlerAdminLogout);

module.exports = router;
