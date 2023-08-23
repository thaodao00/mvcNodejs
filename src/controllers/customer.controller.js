'use strict';
const axios = require('axios');
const brypt = require('bcrypt');
const serviceNote = require('./../services/note.service');
const { uploader, viewImage } = require('./../middlewares/upload');
// Get all note
let getAllNotes = async (req, res) => {
    const userId = req.user.userId;
    console.log("userId___________________", req.user);
    try {
        const notes = await serviceNote.getAllNoteByUser(userId);
        for (const note of notes) {
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
    const { name, description, img } = req.body;
    try {
        if (name && description) {
            const newNote = {
                name: name,
                description: description,
                image: img,
                userId: userId
            };
            // console.log(newNote);
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
        let updated = await serviceNote.updateNote(req.body, noteId);
        if (updated) {
            //   req.flash('', '');
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
        let deleted = await serviceNote.deleteNote(noteId);
        if (deleted) {
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