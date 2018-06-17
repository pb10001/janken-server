var express = require('express');
var router = express.Router();
var passport = require('../passport');
router.get('/', function(req, res){
  res.render('login', {title: 'ログイン'});
});
router.post('/', function(req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
});

module.exports = router;
