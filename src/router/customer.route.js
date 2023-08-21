'use strict';

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');

router.get('/home',customerController.getAllNotes);
router.get('/profile',customerController.getProfile);
router.post('/update-note/:id',customerController.updateNote);
router.post('/create-note',customerController.createNote);
module.exports = router;