var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello Express' });
});

router.get('/hello', function(req, res, next) {
  res.render('index', { title: 'Hi there!' });
});

router.get("/api/city", function (req, res, next) {
  const limit = parseInt(req.query.limit) || 10; // optional limit parameter, default to 10 if not provided
  req.db
    .from("city")
    .select("name", "district")
    .limit(limit) // apply a limit
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
  const sortBy = req.query.sortBy || "name"; // set a default sort by CityName if not provided
  const sortOrder = req.query.sortOrder === "desc" ? "desc" : "asc"; // set the sort order (1 = ascending, -1 = descending)
  
  req.db
    .from("city")
    .select("*")
    .limit(limit)
    .where("CountryCode", "=", req.params.CountryCode)
    .orderBy(sortBy, sortOrder) // apply the sorting
    .then((rows) => {
      res.json( { Error: false, Message: "Success", City: rows });
    })
    .catch((err) => {
      console.log(err);
      res.json({ Error: true, Message: "Error in MySQL query "});
    });
});

module.exports = router;
