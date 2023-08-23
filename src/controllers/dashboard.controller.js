'use strict';
const brypt = require('bcrypt');
const serviceUser = require('../services/user.service');
let getAllUser = async (req, res) => {
    try {
        const users = await serviceUser.getAll();
        res.render("index", {
            view_content: 'admin/dashboard',
            users: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
let addUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await serviceUser.findUserByEmail(email);
        if (user) {
            res.status(400).send('Email already exists');
            return;
        } else {
            const newUser = {
                name: name,
                email: email,
                password: password,
                role: role
            }
            const create = await serviceUser.createUser(newUser);
            res.redirect('/dashboard');

        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
let updateRoleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const update = await serviceUser.updateRole(id, req.body.role);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

let deleteUser = async (req, res) => {
    const ids = req.params.ids.split(',');
    console.log("+++++++++++++++++++++++", ids);
    try {
        const deleteUser = await serviceUser.deleteUser(ids);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}
module.exports = {
    getAllUser: getAllUser,
    addUser: addUser,
    updateRoleUser: updateRoleUser,
    deleteUser: deleteUser

}