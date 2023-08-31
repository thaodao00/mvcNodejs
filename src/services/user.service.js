'use strict'

const models = require('../models');
const bcrypt = require('bcrypt');

//tìm kiếm tk theo email
let getUserById = async (id) => {
    return await models.User.findOne({
        where: {
            id: id
        }
    })
}
let findUserByEmail = async (email) => {
    return await models.User.findOne({
        where: {
            email: email
        }
    })
}

let createUser = async (body) => {
    let user = await findUserByEmail(body.email);
    if (user == null) {
        let newUser = {
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        }
        return await models.User.create(newUser);
    }
    else {
        return false
    }
}

let getAll = async () => {
    return await models.User.findAll({
        order: [['created_at', 'DESC']]
    });
}
let updateRole = async (id, role) => {
    return await models.User.update({ role: role }, {
        where: {
            id: id
        }
    })
}

let deleteUser = async (id) => {
    return await models.User.destroy({
        where: {
            id: id
        }
    })
}


module.exports = {
    findUserByEmail: findUserByEmail,
    createUser: createUser,
    getAll: getAll,
    updateRole: updateRole,
    deleteUser: deleteUser,
    getUserById: getUserById
}