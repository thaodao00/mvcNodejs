const auth = {}
const createError = require('http-errors');
auth.checkAuth = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}
auth.checkAdminRole = (req, res, next) => {
  if (req.session.user && req.session.user.role === 2) {
    next(); // Cho phép tiếp tục xử lý các middleware hoặc route tiếp theo
  } else {
    next(createError(404));
  }
};

module.exports = auth;