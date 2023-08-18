'use strict';

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
router.get('/home',customerController.getHome);
module.exports = router;