'use strict';
const serviceUser = require('./../services/user.service');
const brypt = require('bcrypt');

let getLoginAdmin = (req, res) => {
    res.render('auth/login');
}

let loginUser = async (req, res) => {
    console.log("body", req.body);
    const { email, password } = req.body;
    const user = await serviceUser.findUserByEmail(email);

    // if (user && (await brypt.compare(password, user.password))) {
    if (user && (password == user.password)) {
        req.session.user = {
            email: user.email,
            role: user.role,
            name: user.name

        }
        if (user.role == 2) {
            res.redirect('/dashboard');
        } else if (user.role == 1) {
            res.redirect('/home');
        }
    } else {
        req.flash('error', 'Email or password incorrect');
        res.redirect('/login');
        // res.json({ message: "Email or password incorrect" });
    }
}

module.exports = {
    getLoginAdmin: getLoginAdmin,
    loginUser: loginUser
}