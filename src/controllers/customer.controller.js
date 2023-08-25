'use strict';
const axios = require('axios');
const brypt = require('bcrypt');
const encryption = require('../ultils/encryption');
const fs = require('fs')
const util = require('util')

const unlinkFile = util.promisify(fs.unlink)
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
// const quillDelta = require('quill-delta');
const serviceNote = require('./../services/note.service');
const { uploader, viewImage } = require('./../middlewares/upload');
// Get all note
let getAllNotes = async (req, res) => {
    const userId = req.user.userId;
    console.log("userId___________________", req.user);
    try {
        const notes = await serviceNote.getAllNoteByUser(userId);
        for (const note of notes) {
            const ex = encryption.decryptData(note.description, req.user.secretKey);
            const delta = JSON.parse(ex);
            const converter = new QuillDeltaToHtmlConverter(JSON.parse(delta).ops, {});
            const html = converter.convert();
            note.description = html;
            const imagePath = await viewImage(note.image);
            note.image = imagePath;
        }
        res.render("index", {
            view_content: 'home/home',
            notes: notes,
            flash: req.flash()
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
//Create note
let createNote = async (req, res) => {
    const userId = req.user.userId;
    const { name, description, img, cancel_at } = req.body;
    try {
        if (name && description) {
            const newNote = {
                name: name,
                // description: description,
                description: encryption.encryptData(description, req.user.secretKey),
                image: img,
                userId: userId,
                cancel_at: cancel_at
            };
            console.log("________________", newNote);
            const note = await serviceNote.createNote(newNote);
            res.redirect('/home');
        }
        // res.send('success')
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}
//Update note
let updateNote = async (req, res) => {
    try {
        let noteId = req.params.id;
        if (req.body.img == '') {
            req.body.img = req.body.imageCurrent;
        }
       console.log('------------',req.body.img);
// 
        // const noteOld = await serviceNote.getNoteById(noteId); 

        const note = req.body;
        note.descriptionNote = encryption.encryptData(note.descriptionNote, req.user.secretKey);
        let updated = await serviceNote.updateNote(note, noteId);
        if (updated) {
        //    if (noteOld.image && noteOld.image !== note.img) {
        //         const imagePath = `src/public/uploads/${noteOld.image}`;
        //         await unlinkFile(imagePath);
        //     }  //   req.flash('', '');
            res.redirect('/home');
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }

}
//Delete note
let deleteNote = async (req, res) => {
    try {
        let noteId = req.params.id;
        console.log("_________________", noteId);
        const note = await serviceNote.getNoteById(noteId);

        let deleted = await serviceNote.deleteNote(noteId);
        if (deleted) {
            // Nếu xóa ghi chú thành công, thực hiện xóa tập tin ảnh (nếu có)
            if (note.image) {
                const imagePath = `src/public/uploads/${note.image}`;
                if(imagePath){
                    await unlinkFile(imagePath);

                }
            }
            res.redirect('/home');
        }
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}
//Upload image
const uploadImage = async (req, res) => {
    try {
        const img = await uploader(req.file, 'notes')
        return res.status(200).json({
            key: img,
            path: await viewImage(img)
        })
    } catch (err) {
        res.status(400).json({
            status: false,
            stack: err.stack,
            message: err.message
        })
    }

}
//Get profile
let getProfile = (req, res) => {
    res.render('home/profile');
}
module.exports = {
    getAllNotes: getAllNotes,
    getProfile: getProfile,
    createNote: createNote,
    updateNote: updateNote,
    uploadImage: uploadImage,
    deleteNote: deleteNote,
}