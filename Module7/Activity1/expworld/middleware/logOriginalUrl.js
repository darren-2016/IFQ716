module.exports = function logOriginalUrl (req, res, next) {
  console.log('Request URL:', req.originalUrl);
  next();
};

