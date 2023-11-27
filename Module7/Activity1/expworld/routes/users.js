const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('hello user');
});

router.get('/about', function(req, res, next) {
  res.send("about users");
});

router.post('/register', function(req, res, next) {
  res.send('hello user');
});

router.get('/course/:courseId/unit/:unitId', function (req, res) {
  res.send('you are studying ' + req.params.courseId + ' unit ' + req.params.unitId);
});

router.post('/login', function(req, res, next) {
  const expires_in = 60 * 60 * 24;
  const exp = Math.floor(Date.now() / 1000) + expires_in;
  const token = jwt.sign({ exp }, process.env.JWT_SECRET);
  res.status(200).json({
    token,
    token_type: "Bearer",
    expires_in
  });
});

router.use('/course', require('./users/course'));


module.exports = router;
