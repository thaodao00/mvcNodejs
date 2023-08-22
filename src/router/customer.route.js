'use strict';

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const {upload} = require('../ultils/common');

router.post('/upload-img',upload.single('img'), customerController.uploadImage);
router.get('/home',customerController.getAllNotes);
router.get('/profile',customerController.getProfile);
router.post('/update-note/:id',customerController.updateNote);
router.post('/delete-note/:id', customerController.deleteNote);
router.post('/create-note', customerController.createNote);
module.exports = router;