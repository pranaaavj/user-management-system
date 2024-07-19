const express = require('express');
const {
  handlerAdminLogin,
  handlerAllUsers,
} = require('../controller/adminController');

const router = express.Router();

router.get('/', handlerAdminLogin);
router.get('/users', handlerAllUsers);

module.exports = router;
