const express = require('express');
const session = require('express-session');

let middBasic = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
        secret: 'SecretStringForCookie',
        resave: true,
        // cookie: { maxAge: 60000 },
        saveUninitialized: true
    }))
}

module.exports = middBasic;