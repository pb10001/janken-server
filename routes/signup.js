'use strict';

var express = require('express');
var router = express.Router();
var db = require('../redis_client');
var crypto = require('crypto');
var moment = require('moment');

router.get('/', function(req, res) {
  res.render('signup', {
    title: '新規登録',
    user: req.user || 'Guest'
  });
});
router.post('/', function(req, res) {
  if (req.body['username'] === '' || req.body['password'] === '') {
    res.redirect('/signup');
    return;
  }
  let shasum = crypto.createHash('sha1');
  shasum.update(req.body['password']);
  let hash = shasum.digest('hex');
  let data = {
    nickname: req.body['nickname'],
    user_name: req.body['username'],
    password: hash,
    wins: 0,
    losses: 0,
    draws: 0,
    signup_date: moment()
      .utcOffset('+09:00')
      .format('YYYY/MM/DD HH:mm:ss')
  };
  if (!data.user_name.match(/[^A-Za-z0-9]+/)) {
    db.hget('User', data.user_name, function(err, doc) {
      if (err) {
        console.log(err);
      }
      if (doc) {
        console.log(doc);
        res.redirect('/signup');
      } else {
        db.hset('User', data.user_name, JSON.stringify(data));
        res.redirect('/login');
      }
    });
  } else {
    res.redirect('/signup');
  }
});
module.exports = router;
