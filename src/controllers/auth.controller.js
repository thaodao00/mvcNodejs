    'use strict';
const serviceUser = require('./../services/user.service');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const brypt = require('bcrypt');

let getLoginAdmin = (req, res) => {
    res.render('auth/login',{ errLogin: req.flash('errLogin') });
}
let register = (req, res) => {
    res.render('auth/register',{ error: req.flash('error'),preserveInputs: req.flash('preserveInputs')[0] || {} });
}
const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    try {
        const user = await serviceUser.findUserByEmail(email);
        const redirectWithError = (errorMessage) => {
            req.flash('error', errorMessage);
            req.flash('preserveInputs', req.body); 
            res.redirect('/register');
        };
        if (!name || !email || !password || !confirmPassword) {
            redirectWithError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            redirectWithError('Password confirmation does not match')
            return;
        }

        if (user) {
           redirectWithError('Email already exists');
            return;
        }
        else{
            const newUser = {
                name: name,
                email: email,
                password: password
            };
            const newUserDB = await serviceUser.createUser(newUser);
            // req.flash('success', 'Register success');
            res.redirect('/login');
        }
      
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

let loginUser = async (req, res) => {

    const { email, password } = req.body;
    const user = await serviceUser.findUserByEmail(email);

    if (user && (await brypt.compare(password, user.password))) {
        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            'your-secret-key',
            { expiresIn: '1h' } // Thời gian hết hạn của token
        );
    
        res.cookie('token', token); 
        if (user.role == 2) {
            res.redirect('/dashboard');
        } else if (user.role == 1) {
            res.redirect('/home');
        }
    } else {
        req.flash('errLogin', 'Email or password incorrect');
        res.redirect('/login');
        // res.json({ message: "Email or password incorrect" });
    }
}

let activateAccount =  async (req, res) => {

}
let sendActivationEmail = async (req, res) => {

}

module.exports = {
    getLoginAdmin: getLoginAdmin,
    loginUser: loginUser,
    register: register,
    registerUser: registerUser,
    activateAccount: activateAccount,
    sendActivationEmail

}