const auth = {}

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
      res.status(403).json({ message: "Access denied" }); // Gửi mã lỗi 403 nếu không có quyền
    }
  };
module.exports = auth;