'use strict'

require('dotenv').config()

const express = require('express');

const configApp = require('./config/configApp');
const viewEngine = require('./config/viewEngine');
const connectDB = require('./config/connectDB');
const routesApp = require('./router/index');
const db = require('./models');
const middBasic = require('./middlewares/index');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const { DateTime } = require('luxon')
const errorHandlers = require('./middlewares/errorHandlers')
let app = express();
app.use(cookieParser('SecretStringForCookie'));
middBasic(app);
configApp(app);
viewEngine(app);
app.use(flash());

connectDB.testConnection();
routesApp(app);
let port = process.env.PORT || 3000;


app.use(errorHandlers);


DateTime.local().setZone('Asia/Ho_Chi_Minh');

app.listen(port, async () => {
    console.log("Servidor corriendo en el puerto " + port);
    
    try {
        await db.User.sync();
        await db.Note.sync();
        console.log('Database synchronized');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }
})

module.exports = app;