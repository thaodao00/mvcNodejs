'use strict';

const brypt = require('bcrypt');

let getHome = (req, res) => {
    res.render('home/home');
}
module.exports = {
    getHome: getHome

}