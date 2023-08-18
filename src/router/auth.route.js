'use strict';

const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller');

// router.get('/home', authController.logoutUser);
router.get(['/','/login'], authController.getLoginAdmin);
router.post(['/', '/login'], authController.loginUser);
module.exports = router;