'use strict'

const models = require('../models');
const bcrypt = require('bcrypt');

let getNoteByName = async (name) => {
    return await models.Note.findOne({
        where: {
            'name': name
        }
    })
}
//lấy tất cả post của user

let getAllNoteByUser = async (userId) => {
    return await models.Note.findAll({
        where: {
            'user_id': userId
        }
    })
}

let createNote = async (body) => {
    let note = await getNoteByName(body.name);
    if (note == null) {
        let newNote = {
            name: body.name,
            description: body.description,
            image:body.image,
            user_id: body.userId,
        }
        return await models.Note.create(newNote);
    }
    else{
    return false
    }
}

let updateNote = async (body, noteId) => {
   let updateNote ={
        name:body.nameNote,
        description:body.descriptionNote,
        image:body.img,
        updated_at:new Date()
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
    module.exports = {
        getAllNoteByUser: getAllNoteByUser,
        createNote: createNote,
        updateNote: updateNote,
        getNoteByName:getNoteByName,
        deleteNote:deleteNote
        
    }