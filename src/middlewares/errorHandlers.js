const createError = require('http-errors');
const errorHandler = (err, req, res, next) => {
    if (err.status === 404) {
      res.status(404);
      res.render('error', { error: err, img:'https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-1932.jpg?w=2000' });
    } else if (err.status === 401) {
      res.status(401);
      res.render('error', { error: err, img:"https://www.shutterstock.com/image-vector/401-error-rbg-color-icon-260nw-2046446501.jpg" });
    } else {
      res.status(err.status || 500);
      res.render('error', { error: err, img:'https://img.freepik.com/free-vector/500-internal-server-error-concept-illustration_114360-5572.jpg?w=2000' });
    }
  };

  module.exports = errorHandler;