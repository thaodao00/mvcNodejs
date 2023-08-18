const path = require('path');

let configViewEngine = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './../views'));   
}

module.exports = configViewEngine;