'use strict';
const encryption = require('../ultils/encryption');
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;
const serviceNote = require('./../services/note.service');
const serviceUser = require('./../services/user.service');
const { uploader, viewImage } = require('./../middlewares/upload');
const { sendEditRequestEmail } = require('./../ultils/emailer');
const socketManager = require('./../ultils/socketManager');
const moment = require('moment');
// const Delta = require('quill-delta');
// const e = require('connect-flash');
var loading = false
// Get all notes by user
let getAllNotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 2;
    const userId = req.user.userId;
    const searchTerm = req.query.searchTerm;

    try {
        let listNote;
        if (searchTerm) {
            listNote = await serviceNote.searchNotes(userId, searchTerm, page, pageSize);

            console.log("listNote___________________", listNote.currentPage, listNote.totalPages, pageSize, listNote.notes.length);
        } else {
            listNote = await serviceNote.getAllNoteByUser(userId, page, pageSize);

        }
        for (const note of listNote.notes) {
            const ex = encryption.decryptData(note.description, req.user.secretKey);
            const delta = JSON.parse(ex);
            const converter = new QuillDeltaToHtmlConverter(JSON.parse(delta).ops, {});
            const html = converter.convert();
            note.description = html;
            const imagePath = await viewImage(note.image);
            note.image = imagePath;
        }
        // console.log("pag_________", listNote.currentPage, listNote.totalPages, pageSize);
        res.render("index", {
            view_content: 'home/home',
            notes: listNote.notes,
            currentPage: listNote.currentPage,
            totalPages: listNote.totalPages,
            pageSize: pageSize,
            searchTerm: searchTerm,
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
            const note = await serviceNote.createNote(newNote);
            const ex = encryption.decryptData(note.description, req.user.secretKey);
            const delta = JSON.parse(ex);
            const converter = new QuillDeltaToHtmlConverter(JSON.parse(delta).ops, {});
            const html = converter.convert();
            note.description = html;
            const date = moment(note.created_at).utcOffset(7).format('h:mm A, MMMM D, YYYY')
            console.log(date,"____________________date");
            note.created_at =date
            console.log( note.created_at,"____________________date");
            const imagePath = await viewImage(note.image);
            note.image = imagePath;
           

            const io = socketManager.getSocketIOInstance();
            io.emit('newNote', note);
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

        const noteCurrent = await serviceNote.getNoteById(noteId);
        console.log('------------image', noteCurrent.image);

        const note = req.body;
        if (!note.img) {
            note.img = req.body.imageCurrent;
        }
        note.descriptionNote = encryption.encryptData(note.descriptionNote, req.user.secretKey);
        let updated = await serviceNote.updateNote(note, noteId);
        if (updated) {
            // Nếu có ảnh mới và khác với ảnh cũ, xóa ảnh cũ
            if (note.img && noteCurrent.image) {
                const imagePath = `src/public/uploads/${noteCurrent.image}`;
                await unlinkFile(imagePath);

            }

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

        let deleted = await serviceNote.deleteNote(noteId);
        const note = await serviceNote.getNoteById(noteId);
        // if (deleted) {
        // Nếu xóa ghi chú thành công, thực hiện xóa tập tin ảnh (nếu có)
        if (note && note.image) {
            const imagePath = `src/public/uploads/${note.image}`;
            if (imagePath) {
                await unlinkFile(imagePath);

            }
        }
        res.redirect('/home');
        // }
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
//Get all notes public
var loading = false

let getNotesPublic = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const pageSize = parseInt(req.query.pageSize) || 2;

    try {
        const listNotes = await serviceNote.getAllNote(page, pageSize)
        const updateNote = []
        for (const note of listNotes.notes) {
            const id = note.user_id;
            const user = await serviceUser.getUserById(id);
            const ex = encryption.decryptData(note.description, user.secretKey);
            const delta = JSON.parse(ex);
            const converter = new QuillDeltaToHtmlConverter(JSON.parse(delta).ops, {});
            const html = converter.convert();
            note.description = html;
            const imagePath = await viewImage(note.image);
            note.image = imagePath;
            note.author = user.name;
            updateNote.push(note)
        }
        console.log("pagss_________", listNotes.currentPage, listNotes.totalPages, pageSize);

        res.render("index", {
            view_content: 'home/notes',
            notes: updateNote,
            isLoading: loading,
            totalPages: listNotes.totalPages,
            currentPage: listNotes.currentPage,
            pageSize: pageSize,
            flash: req.flash()
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
//Share note
let shareNote = async (req, res) => {
    try {
        let noteId = req.params.id;
        const noteShared = await serviceNote.sharedNote(noteId, req.body);
        res.redirect('/home');
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
}
let changeSharedNote = async (req, res) => {
    // showLoadingSpinner()
    try {
        let noteId = req.params.id;
        let note = await serviceNote.getNoteById(noteId);
        let user = await serviceUser.getUserById(note.user_id);
        loading = true
        sendEditRequestEmail(user.email, "Request editing permission", `Someone wants you to open the right to edit note ${note.name}.`)
            .then(response => {
                loading = false
                console.log('Email sent successfully:', response);
            })
            .catch(error => {
                loading = false
                console.error('Error sending email:', error);

            });
        loading = false
        res.redirect('/notes');
    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }
    // hideLoadingSpinner()
};
let editNoteByUses = async (req, res) => {
    try {
        let noteId = req.params.id;

        const note = await serviceNote.getNoteById(noteId);
        const user = await serviceUser.getUserById(note.user_id);


        note.descriptionNote = encryption.encryptData(req.body.descriptionNote, user.secretKey);
        console.log('------------image', req.user,);

        let updated = await serviceNote.editByUsers(noteId, note.descriptionNote);
        console.log(req.user);
        if (updated) {
           await sendEditRequestEmail(user.email, "Edited notes", `Note ${note.name} has been edited by ${req.user.email}.`)
            console.log(user.email, "______________________email");
            res.redirect('/notes');
        }

    } catch (e) {
        console.log(e);
        return res.status(500).send(e.message);
    }

}
module.exports = {
    getAllNotes: getAllNotes,
    getNotesPublic: getNotesPublic,
    createNote: createNote,
    updateNote: updateNote,
    uploadImage: uploadImage,
    deleteNote: deleteNote,
    shareNote: shareNote,
    changeSharedNote: changeSharedNote,
    editNoteByUses: editNoteByUses
}