'use strict';
const axios = require('axios');
const brypt = require('bcrypt');
const serviceNote = require('./../services/note.service');
let getAllNotes = async (req, res) => {
    const userId = req.user.userId;
    console.log("userId", userId);
    try {
        const notes = await serviceNote.getAllNoteByUser(userId);
        res.render("index", {
            view_content: 'home/home',
            notes: notes,
            flash: req.flash()
        });
        // console.log("notes", notes);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
let createNote = async (req, res) => {
    const userId = req.user.userId;
    const { name, description } = req.body;
    // const note = await serviceNote.getNoteByName(name);
    try {
        // if (note) {
        //     req.flash('error', "Note already exists");
        //     res.redirect('/home');
        //     // return
        // }
        if (name && description) {
            const newNote = {
                name: name,
                description: description,
                userId: userId
            };
            const note = await serviceNote.createNote(newNote);
            res.redirect('/home');
        }
        // res.send('success')
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);

    }
}
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


let getProfile = (req, res) => {
    res.render('home/profile');
}
module.exports = {
    getAllNotes: getAllNotes,
    getProfile: getProfile,
    createNote: createNote,
    updateNote: updateNote

}