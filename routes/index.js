var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'じゃんけん', user: req.user || 'Guest' });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/login');
});
module.exports = router;
