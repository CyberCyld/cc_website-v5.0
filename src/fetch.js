
var express = require('express');
var router = express.Router();
const db = require('./dataBase');

router.get('/fetchall', function(req, res, next) {
  var query = 'select * from users';
  db.query(query, function(err, rows, fields) {
    if (err) throw err;
    //res.json(rows);
    res.render('admindashboard', { title: 'Products', products: rows});
  })
});
module.exports = router;

