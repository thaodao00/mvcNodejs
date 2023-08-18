const Sequelize = require('sequelize');
require('dotenv').config();
let host = process.env.DB_HOST;
let username = process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;
let dialect = 'mysql';

const sequelize = new Sequelize(database, username, password, {
    host: host,
    dialect: dialect,
    logging: false,
})

let testConnection = async () => {
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }catch(error){
        console.log('Unable to connect to the database:', error);
    }
}

module.exports = {
    testConnection: testConnection,
    host: host,
    username: username,
    password: password,
    dialect: dialect,
    database: database,
}