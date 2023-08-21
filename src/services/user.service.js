'use strict'

const models = require('../models');
const bcrypt = require('bcrypt');

//tìm kiếm tk theo email

let findUserByEmail = async (email) => {
    return await models.User.findOne({
        where:{
            email: email
        }
    })
}

let createUser = async (body) => {
    let user = await findUserByEmail(body.email);
    if(user ==null){
        let newUser = {
           name: body.name,
           email: body.email,
           password: bcrypt.hashSync(body.password, 10),
        }
        return await models.User.create(newUser);
    }
    else{
        return false
    }
}
module.exports = {
    findUserByEmail: findUserByEmail,
    createUser: createUser
}