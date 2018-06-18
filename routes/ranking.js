var express = require('express');
var router = express.Router();
var db = require('../redis_client');
var async = require('async');
router.get('/', function(req, res) {
  db.hgetall('User', function(err, docs) {
    async.map(
      docs,
      function(usr, callback) {
        var obj = JSON.parse(usr);
        var divZero = obj.wins + obj.losses + obj.draws == 0;
        var rate = divZero
          ? '-'
          : Math.round(
              (1000 * obj.wins) / (obj.wins + obj.losses + obj.draws)
            ) / 10.0;
        callback(null, {
          user_name: obj.user_name,
          nickname: obj.nickname,
          rate: rate
        });
      },
      function(err, users) {
        var list = users.sort(function(a, b) {
          if (a.rate == '-') return 1;
          if (b.rate == '-') return -1;
          if (a.rate > b.rate) return -1;
          else return 1;
        });
        res.render('ranking', {
          title: 'ランキング',
          list: list,
          user: req.user || 'Guest'
        });
      }
    );
  });
});

module.exports = router;
