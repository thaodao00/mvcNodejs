'use strict'

const models = require('../models');
const bcrypt = require('bcrypt');

//tìm kiếm tk theo id
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

// let getAll = async () => {
//     return await models.User.findAll({
//         order: [['created_at', 'DESC']]
//     });
// }
let getAll = async (page, pageSize)=> {
    const offset = (page - 1) * pageSize;
    const users = await models.User.findAll({
        order: [['created_at', 'DESC']],
        offset: offset,
        limit: pageSize,
    });

    const totalCount = await models.User.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        users: users,
        currentPage: page,
        totalPages: totalPages,
    };
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