const express = require('express');
const session = require('express-session');

let middBasic = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret :'secret showa denki'
    }))
}

module.exports = middBasic;