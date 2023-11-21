var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;
