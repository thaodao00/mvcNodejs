'use strict'
const models = require('../models');
const bcrypt = require('bcrypt');
const schedule = require('node-schedule');
const jobManager = require('../ultils/noteManager');
const encryption = require('../ultils/encryption');
let getNoteByName = async (name) => {
    return await models.Note.findOne({
        where: {
            'name': name
        }
    })
}
let getNoteById = async (id) => {
    return await models.Note.findOne({
        where: {
            'id': id
        }
    })
}
//lấy tất cả post của user

let getAllNoteByUser = async (userId) => {
    return await models.Note.findAll({
        where: {
            'user_id': userId
        },
        order: [
            ['created_at', 'DESC'] // Sắp xếp theo trường created_at từ mới đến cũ
        ]
    })
}

let updateNote = async (body, noteId) => {
    let updateNote = {
        name: body.nameNote,
        description: body.descriptionNote,
        image: body.img,
        updated_at: new Date()
    }
    return await models.Note.update(updateNote,
        {
            where: {
                id: noteId
            }
        }
    );
};
let deleteNote = async (noteId) => {
    return await models.Note.destroy({
        where: {
            id: noteId
        }
    });
}
let createNote = async (body) => {

    try {
        let note = {
            name: body.name,
            // description:encryption.encryptData(body.description,req.user.secretKey),
            description: body.description,
            image: body.image,
            user_id: body.userId,
            cancel_at: null
        }

        if (body.cancel_at !== null) {
            note.cancel_at = new Date(new Date().getTime() + body.cancel_at * 60 * 60 * 1000)

            // note.cancel_at = new Date(new Date().getTime() + body.cancel_at * 1000);
            const newNote = await models.Note.create(note);

            if (newNote.cancel_at !== null && !isNaN(body.cancel_at)) {
                const job = schedule.scheduleJob(newNote.cancel_at, async () => {
                    await deleteNote(newNote.id);
                });
                newNote.cancelJob = job;
                jobManager.addJob(job);
            }
            return newNote;

           
        }

    } catch (error) {
        throw error;
    }
}
module.exports = {
    getAllNoteByUser: getAllNoteByUser,
    createNote: createNote,
    updateNote: updateNote,
    getNoteByName: getNoteByName,
    deleteNote: deleteNote,
    getNoteById: getNoteById

}