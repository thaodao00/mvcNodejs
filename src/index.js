'use strict'

require('dotenv').config()

const express = require('express');

const configApp = require('./config/configApp');
const viewEngine = require('./config/viewEngine');
const connectDB = require('./config/connectDB');
const routesApp = require('./router/index');
const db = require('./models');
const middBasic = require('./middlewares/index');
const flash = require('connect-flash')
let app = express();
middBasic(app);
configApp(app);
viewEngine(app);
app.use(flash());

connectDB.testConnection();
routesApp(app);
let port = process.env.PORT || 3000;



app.listen(port, async () => {
    console.log("Servidor corriendo en el puerto " + port);
    
    try {
        await db.User.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})

module.exports = app;