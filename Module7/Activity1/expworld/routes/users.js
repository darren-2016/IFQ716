const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// class for extended status code/error handling
class StatusError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('hello user');
});

router.get('/about', function(req, res, next) {
  res.send("about users");
});

router.post('/register', function(req, res, next) {
  // Retrieve email and password from req.body
  const email = req.body.email;
  const password = req.body.password;

  // Verify body
  if (!email || !password) {
    return res.status(400).json({ error: true, message: "Request body incomplete - email and password needed" });
  }

  // Determine if user already exists in table
  const queryUsers = req.db.from("users").select("*").where("email", "=", email);

  queryUsers
    .then(users => {
    if (users.length > 0) {
      console.log("User already exists");
      throw new StatusError('User already exists', 400);
      // return; // res.status(400).json({ error: true, message: "User already exists"});
    }

    // If user does not exist, insert into table
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return req.db.from("users").insert({ email, hash });
  })
  .then(() => {
    console.log("Successfully inserted user");
    res.status(201).json({ success: true, message: "User created" });
  })
  .catch((err) => {
    if (err instanceof StatusError) {
      console.log(`Error: ${err.statusCode}, ${err.message}`);
      res.status(err.statusCode).json({ error: true, message: err.message });
    } else {
      console.log("User registration error");
      res.status(500).json({ error: true, message: "User registration error" });
    }    
  });
});

router.get('/course/:courseId/unit/:unitId', function (req, res) {
  res.send('you are studying ' + req.params.courseId + ' unit ' + req.params.unitId);
});

router.post('/login', function(req, res, next) {
  // 1. Retrieve email and password from req.body
  const email = req.body.email;
  const password = req.body.password;

  // Verify body
  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request body incomplete - email and password needed"
    });
    return;
  }

  // 2. Determine if user already exists in table
  const queryUsers = req.db.from("users").select("*").where("email", "=", email);
  queryUsers
    .then(users => {
      if (users.length === 0) {
        console.log("User does not exist");
        res.status(400).json({
          error: true,
          message: "User does not exist"
        });
        return;
      }
    //   console.log("Uer exists in table");
    // });

  // 2.1 If user does exist, verify if passwords match
    const user = users[0];
    return bcrypt.compare(password, user.hash);
  })
  .then(match => {
    if (!match) {
      console.log("Passwords do not match");
      res.status(400).json({
        error: true,
        message: "Password not recognised"
      });
      return;
    }
    // console.log("Passwords match");

    // Create and return JWT token
    const expires_in = 60 * 60 * 24; // 24 hours
    const exp = Math.floor(Date.now() / 1000) + expires_in;
    const token = jwt.sign({ email, exp }, process.env.JWT_SECRET);
    res.status(200).json({
      token,
      token_type: "Bearer",
      expires_in
    });

  // 2.2 If user does not exist, return error response

});
});

router.use('/course', require('./users/course'));


module.exports = router;
