const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send('hello index');
});

router.get('/api', function(req, res, next) {

});

router.get("/api/city", function (req, res, next) {
  const limit = parseInt(req.query.limit) || 10; // optional limit parameter, default to 10 if not provided
  const sortBy = req.query.sortBy || "name"; // set a default sort by name if not provided
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // set the sort order

  req.db
    .from("city")
    .select("name", "district")
    .limit(limit) // apply a limit
    .orderBy(sortBy, sortOrder) // apply the sorting
    .then((rows) => {
      res.json({ Error: false, Message: "Success", City: rows });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
});

router.get("/api/city/:CountryCode", function (req, res, next) {
  const limit = parseInt(req.query.limit) || 10; // optional limit parameter, default to 10 if not provided
  const sortBy = req.query.sortBy || "name"; // set a default sort by name if not provided
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // set the sort order

  req.db
    .from("city")
    .select("*")
    .limit(limit) // apply a limit
    .where("CountryCode", "=", req.params.CountryCode)
    .orderBy(sortBy, sortOrder) // apply the sorting
    .then((rows) => {
      res.json({ Error: false, Message: "Success", City: rows });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query" });
    });
});

router.post('/api/update', (req, res) => {
  const filter = { Name: req.body.City, CountryCode: req.body.CountryCode };
  const pop = { Population: req.body.Pop };

//  console.log(filter);
//  console.log(pop);

  if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
    res.status(400).json({ message: `Error updating population` });
    console.log(`Error on request body`, JSON.stringify(req.body));
  } else {
    req.db
      .from('city').where(filter).update(pop)
      .then(_ => {
        res.status(201).json({ message: `Successful update ${req.body.City}`});
        console.log(`successful population update:`, JSON.stringify(filter));
      }).catch(error => {
        console.log(error);
        res.status(500).json({message: 'Database error - not updated'});
      });
  }
});

module.exports = router;
