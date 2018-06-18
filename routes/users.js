var express = require('express');
var db = require('../redis_client');
var async = require('async');
var util = require('../util');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.hgetall('User', function(err, docs) {
    var txt = '';
    async.map(
      docs,
      function(doc, callback) {
        callback(null, JSON.parse(doc));
      },
      function(err, roster) {
        if (err) res.send(err);
        else
          res.render('users', {
            title: 'ユーザー一覧',
            roster: roster,
            user: req.user || 'Guest'
          });
      }
    );
  });
});
router.get('/:id', function(req, res) {
  db.hget('User', req.params.id, function(err, doc) {
    if (err) {
      res.send('ユーザーが存在しません。');
    }
    if (doc) {
      db.hgetall('Match', function(err, docs) {
        if (err) res.send(err);
        if (docs) {
          async.filter(
            docs,
            function(usr, callback) {
              callback(null, JSON.parse(usr).player === req.params.id);
            },
            function(err, matches) {
              var list = matches.map(x => {
                var obj = JSON.parse(x);
                return obj;
              });
              res.render('user_detail', {
                user: req.user || 'Guest',
                user_obj: JSON.parse(doc),
                matches: list
              });
            }
          );
        } else {
          var list = [];
          res.render('user_detail', {
            user: req.user || 'Guest',
            user_obj: JSON.parse(doc),
            matches: list
          });
        }
      });
    } else {
      res.send('ユーザーが存在しません');
    }
  });
});

module.exports = router;
