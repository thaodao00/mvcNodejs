const authRouteBE = require('./auth.route');
const dashboard = require('./dashboard.route');
const customerRoute = require('./customer.route');
const middleware = require('./../middlewares/auth');
const routesApp = (app) => {
    app.use('/', authRouteBE,middleware.checkAuth);
    app.use('/', customerRoute,middleware.checkAuth);
    app.use("/dashboard",middleware.checkAuth, middleware.checkAdminRole,dashboard);
    

}

module.exports = routesApp;