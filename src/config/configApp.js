const express = require('express');
const logger = require('morgan');
const path = require('path');

let configApp = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json())
    app.use(logger('dev'))
    app.use(express.static(path.join(__dirname, './../public')))
    
}

module.exports = configApp;