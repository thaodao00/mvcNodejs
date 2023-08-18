'use strict';
const brypt = require('bcrypt');

let getDashboard = (req, res) => {
    res.render('admin/dashboard');
}
module.exports = {
    getDashboard: getDashboard

}