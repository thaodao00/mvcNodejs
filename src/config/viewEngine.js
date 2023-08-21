const path = require('path');
const moment = require('moment');
let configViewEngine = (app) => {
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, './../views'));
    app.locals.moment = function (date) {
        return moment(date)
            .utcOffset(7)
            // .locale('vi')
            .format('D MMMM YYYY'); // Điều chỉnh múi giờ và định dạng ngày tháng
    }
}

module.exports = configViewEngine;