'use strict';

const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller');



router.get('/register', authController.register);
router.post('/register', authController.registerUser);

router.get(['/','/login'], authController.getLoginAdmin);
router.post(['/', '/login'], authController.loginUser);
router.get('/logout', authController.logout);
module.exports = router;