'use strict';

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');

router.post('/delete-user/:ids',dashboardController.deleteUser);
router.post('/update-user/:id',dashboardController.updateRoleUser);
router.get('/dashboard',dashboardController.getAllUser);
router.post('/add-user',dashboardController.addUser);
module.exports = router;