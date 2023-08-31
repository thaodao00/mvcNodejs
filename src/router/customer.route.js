'use strict';

const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customer.controller');
const {upload} = require('../ultils/common');


router.post('/upload-img',upload.single('img'), customerController.uploadImage);
router.get('/home',customerController.getAllNotes);
router.get('/notes',customerController.getNotesPublic);
router.post('/edit-note/:id',customerController.editNoteByUses);
router.post('/change-share-note/:id',customerController.changeSharedNote)
router.post('/share-note/:id',customerController.shareNote);
router.post('/update-note/:id',customerController.updateNote);
router.post('/delete-note/:id', customerController.deleteNote);
router.post('/create-note', customerController.createNote);
module.exports = router;