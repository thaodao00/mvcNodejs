const auth = {}
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

auth.checkAuth = (req, res, next) => {
  const token = req.cookies.token; // Lấy token từ cookie (hoặc bạn có thể lấy từ tiêu đề Authorization)

  if (!token) {
      res.redirect('/login');
  } else {
      jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
          if (err) {
              res.redirect('/login'); // Hoặc có thể trả về lỗi Unauthorized
          } else {
              req.user = decodedToken; // Lưu thông tin người dùng vào req.user
              next();
          }
      });
  }
};
auth.checkAdminRole = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        next(createError(404));
    } else {
        jwt.verify(token, 'your-secret-key', (err, decodedToken) => {
            if (err || decodedToken.role !== 2) {
                next(createError(404));
            } else {
                req.user = decodedToken;
                next();
            }
        });
    }
};
module.exports = auth;

