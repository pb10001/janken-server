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
        var point = obj.wins - obj.losses; //勝ち点 勝ち: 1 あいこ: 0 負け: -1
        callback(null, {
          user_name: obj.user_name,
          nickname: obj.nickname,
          point: point,
          wins: obj.wins,
          losses: obj.losses,
          draws: obj.draws
        });
      },
      function(err, users) {
        var list = users.sort(function(a, b) {
          if (a.point > b.point) return -1;
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
