'use strict'
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const models = require('../models');
const schedule = require('node-schedule');
const jobManager = require('../ultils/noteManager');
const socketManager = require('../ultils/socketManager');
const { sendEditRequestEmail } = require('../ultils/emailer');
const serviceUser = require('./user.service');
const { Op } = require('sequelize');
const encryption = require('../ultils/encryption');
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter;


//Lấy tất cả các note ở chế độ public
let getAllNote = async (page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const notes = await models.Note.findAll({
        order: [['created_at', 'DESC']],
        where: {
            shared: 1
        },
        offset: offset,
        limit: pageSize,


    })
    const totalCount = await models.Note.count({
        where: {
            shared: 1 // Thay userId bằng giá trị userID mà bạn muốn sử dụng
        }
    })
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        notes: notes,
        currentPage: page,
        totalPages: totalPages
    }

}
let sharedNote = async (noteId, body) => {
    return await models.Note.update({
        shared_role: body.share_role,
        shared: 1
    }, {
        where: {
            id: noteId
        }
    })

}
let changeSharedNote = async (noteId) => {
    return await models.Note.update({
        share_role: 1
    }, {
        where: {
            id: noteId
        }
    })
}
let editByUsers = async (noteId, body) => {
    return await models.Note.update({
        description: body,

    }, {
        where: {
            id: noteId
        }
    })
}
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

const searchNotes = async (userId, searchTerm, page, pageSize) => {
    const notesFromDatabase = await getNotes(userId);
    const offset = (page - 1) * pageSize;
    const searchTermLower = searchTerm.toLowerCase(); 
    const user = await serviceUser.getUserById(userId);
    // Lấy danh sách ghi chú từ cơ sở dữ liệu
    const { count: totalCount } = await models.Note.findAndCountAll({
        where: {
            user_id: userId
        },
        offset: offset,
        limit: pageSize,
        order: [['created_at', 'DESC']]
    });

    // Tìm kiếm trong nội dung văn bản
    let matchingNotes = [];
   
    for (const encryptedNote of notesFromDatabase) {
        const ex = encryption.decryptData(encryptedNote.description, user.secretKey);
        const delta = JSON.parse(ex);
        const delte = JSON.parse(delta);
        const converter = new QuillDeltaToHtmlConverter(delte.ops, {});
        const htmlContent = converter.convert();
        if (htmlContent && htmlContent.toLowerCase().includes(searchTermLower)) {
            matchingNotes.push(encryptedNote);
        }
    }
    const endIndex = Math.min(offset + pageSize, matchingNotes.length);
    const totalPages = Math.ceil(matchingNotes.length / pageSize);
    matchingNotes = matchingNotes.slice(offset, endIndex);

    return {
        notes: matchingNotes,
        currentPage: page,
        totalPages: totalPages,
        limit: pageSize
    };
};
//lấy tất cả post của user
let getAllNoteByUser = async (userId, page, pageSize) => {
    const offset = (page - 1) * pageSize;
    const notes = await models.Note.findAll({
        order: [['created_at', 'DESC']],
        where: { 'user_id': userId },
        offset: offset,
        limit: pageSize
    })
    const totalCount = await models.Note.count({
        where: { 'user_id': userId },
    })
    const totalPages = Math.ceil(totalCount / pageSize);
    return {
        notes: notes,
        currentPage: page,
        totalPages: totalPages
    }
}

let getNotes = async (userId) => {
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
            const user = await serviceUser.getUserById(newNote.user_id);
            if (newNote.cancel_at !== null) {
                const job = schedule.scheduleJob(newNote.cancel_at, async () => {
                    await deleteNote(newNote.id);
                });
                newNote.cancel_at = job;
                jobManager.addJob(job, newNote.id);
            }

            console.log(jobManager.jobs, "___________________job");
            const notificationDate = new Date(cancelDate.getTime() - 60 * 60 * 1000); // Trừ đi 1 tiếng
            const currentTime = new Date();
            const timeUntilNotification = notificationDate - currentTime;
            // const io = socketManager.getSocketIOInstance();

            if (timeUntilNotification > 0) {
                const notificationJob = schedule.scheduleJob(notificationDate, () => {
                    // io.emit('noteAboutToBeCancelled', `Note ${newNote.name} will be cancelled in 1 hour.`);
                    sendEditRequestEmail(user.email, "Cancel notes after 1 hour!", `Note ${newNote.name} will cancel after 1 hour.`)

                });

                jobManager.addJob(notificationJob, newNote.id, true); // Đánh dấu là công việc thông báo
            }
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
    const user = await serviceUser.getUserById(note.user_id);
    await models.Note.destroy({
        where: {
            id: noteId
        }
    });

    if (note?.image && note?.image !== "" && note?.image !== undefined) {
        const imagePath = `src/public/uploads/${note?.image}`;
        if (imagePath) {
            await unlinkFile(imagePath);
        }
    }
    // const io = socketManager.getSocketIOInstance();
    // console.log('io:__________________', io);

    // if (io) {
    //     io.emit('noteDeleted', `Canceled note ${note.name} successfully`);
    // }
    sendEditRequestEmail(user.email, "Delete note success!", `Delete note ${note.name} successfully.`)
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
                const user = await serviceUser.getUserById(newNote.user_id);
                if (newNote.cancel_at !== null) {
                    const job = schedule.scheduleJob(newNote.cancel_at, async () => {
                        await deleteNote(newNote.id);
                    });
                    newNote.cancel_at = job;
                    jobManager.addJob(job, newNote.id);
                    // jobManager.jobs.push({ noteId: newNote.id, job });
                }
                const notificationDate = new Date(cancelDate.getTime() - 60 * 60 * 1000); // Trừ đi 1 tiếng
                const currentTime = new Date();
                const timeUntilNotification = notificationDate - currentTime;
                // const io = socketManager.getSocketIOInstance();

                if (timeUntilNotification > 0) {
                    const notificationJob = schedule.scheduleJob(notificationDate, () => {
                        // io.emit('noteAboutToBeCancelled', `Note ${newNote.name} will be cancelled in 1 hour.`);
                        sendEditRequestEmail(user.email, "Cancel notes after 1 hour!", `Note ${newNote.name} will cancel after 1 hour.`)

                    });

                    jobManager.addJob(notificationJob);
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
    getNoteById: getNoteById,
    getAllNote: getAllNote,
    sharedNote: sharedNote,
    changeSharedNote: changeSharedNote,
    editByUsers: editByUsers,
    searchNotes: searchNotes,
    getNotes: getNotes
}