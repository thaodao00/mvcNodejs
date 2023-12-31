const authRouteBE = require('./auth.route');
const dashboard = require('./dashboard.route');
const customerRoute = require('./customer.route');
const middleware = require('./../middlewares/auth');
const errorHandlers = require('./../middlewares/errorHandlers');

const routesApp = (app) => {
    app.use('/', authRouteBE,middleware.checkAuth);
    app.use('/', customerRoute, middleware.checkAuth);
    app.use('/',middleware.checkAuth,middleware.checkAdminRole,dashboard);
    app.use(errorHandlers)

}

module.exports = routesApp;