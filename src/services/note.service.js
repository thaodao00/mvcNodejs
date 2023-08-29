'use strict'
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const models = require('../models');
// const bcrypt = require('bcrypt');
const schedule = require('node-schedule');
const jobManager = require('../ultils/noteManager');
const socketManager = require('../ultils/socketManager');
// const encryption = require('../ultils/encryption');
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
        updated_at: new Date(),
        cancel_at: null
    }
    try {
        if (body.cancel_at !== undefined && body.cancel_at !== null && body.cancel_at !== "") {
            const cancelDate = new Date(body.cancel_at);
            updateNote.cancel_at = cancelDate;

            const existingJob = jobManager.jobs.find(job => job.id === noteId);
            if (existingJob) {
                existingJob.job.cancel();
                jobManager.removeJob(existingJob.job);
            }

            await models.Note.update(updateNote, {
                where: {
                    id: noteId
                }
            });

            // Tìm ghi chú sau khi cập nhật
            const newNote = await models.Note.findByPk(noteId);

            if (newNote.cancel_at !== null) {
                const job = schedule.scheduleJob(newNote.cancel_at, async () => {
                    await deleteNote(newNote.id);
                });
                newNote.cancel_at = job;
                jobManager.addJob(job, newNote.id);
            }

            console.log(jobManager.jobs, "___________________job");
            return newNote;
        } else {
            const newNote = await models.Note.update(updateNote, {
                where: {
                    id: noteId
                }
            });
            return newNote;
        }
    } catch (error) {
        throw error;
    }
}
let deleteNote = async (noteId) => {
    const note = await getNoteById(noteId);
    await models.Note.destroy({
        where: {
            id: noteId
        }
    });
    if (note.image && note.image !== "" && note.image !== undefined) {
        const imagePath = `src/public/uploads/${note.image}`;
        if (imagePath) {
            await unlinkFile(imagePath);
        }
    }
    const io = socketManager.getSocketIOInstance();
    if (io) {
        io.emit('noteDeleted', `Canceled note ${note.name} successfully`);
    }

}

const createNote = async (body) => {
    try {
        let note = {
            name: body.name,
            description: body.description,
            image: body.image,
            user_id: body.userId,
            cancel_at: null
        };

        if (body.cancel_at !== undefined && body.cancel_at !== null && body.cancel_at !== "") {
            const cancelDate = new Date(body.cancel_at);

            if (cancelDate > new Date()) {
                note.cancel_at = cancelDate;
                const newNote = await models.Note.create(note);

                if (newNote.cancel_at !== null) {
                    const job = schedule.scheduleJob(newNote.cancel_at, async () => {
                        await deleteNote(newNote.id);
                    });
                    newNote.cancel_at = job;
                    jobManager.addJob(job, newNote.id);
                    // jobManager.jobs.push({ noteId: newNote.id, job });
                }
                console.log(jobManager.jobs, "___________________");
                return newNote;
            } else {
                throw new Error("The cancellation date must be in the future.");
            }
        } else {
            const newNote = await models.Note.create(note);
            return newNote;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllNoteByUser: getAllNoteByUser,
    createNote: createNote,
    updateNote: updateNote,
    getNoteByName: getNoteByName,
    deleteNote: deleteNote,
    getNoteById: getNoteById

}