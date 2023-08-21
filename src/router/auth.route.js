'use strict';

const express = require('express');
const router = express.Router();
const authController = require('./../controllers/auth.controller');


router.post('/send-activation-email', authController.sendActivationEmail);
// router.get('/activate', authController.activateAccount);

router.get('/register', authController.register);
router.post('/register', authController.registerUser);

router.get(['/','/login'], authController.getLoginAdmin);
router.post(['/', '/login'], authController.loginUser);
module.exports = router;