var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../redis_client');

router.get('/', function(req, res) {
  res.render('match', {title: 'じゃんけん', user: req.user|| 'Guest' });
});
router.post('/result', function(req, res) {
  var max = -1;
  db.hgetall('Match', function(err, docs){
    for(var key in docs){
      var obj = JSON.parse(docs[key]);
      if (obj.id > max) {
        max = obj.id;
      }
    }
    var rnd = Math.floor( Math.random() * (3));
    var robotHand = rnd == 0 ? 'stone': rnd==1? 'scissors': 'paper';
    var result = 0;// 0:プレイヤー勝ち, 1:ロボ勝ち, 2: あいこ

    if (req.body['hand'] === 'stone') {
      if (rnd == 0) result = 2;
      else if(rnd == 1) result = 0;
      else if(rnd == 2) result = 1;
    }
    else if(req.body['hand'] === 'scissors'){
      if (rnd == 0) result = 1;
      else if(rnd == 1) result = 2;
      else if(rnd == 2) result = 0;
    }
    else if(req.body['hand'] === 'paper'){
      if (rnd == 0) result = 0;
      else if(rnd == 1) result = 1;
      else if(rnd == 2) result = 2;
    }
    else{
      res.send('エラー');
    }
    var data = {
      id: max + 1,
      player: req.user,
      result: result,
      player_hand: req.body['hand'],
      robot_hand: robotHand,
      date: moment().zone("+09:00").format('YYYY/MM/DD HH:mm:ss')
    };
    db.hset('Match', data.id, JSON.stringify(data));
    db.hget('User', req.user, function(err, doc){
      var usr = JSON.parse(doc);
      if(result == 0) usr.wins++;
      if(result == 2) usr.draws++;
      if(result == 1) usr.losses++;
      db.hset('User', req.user, JSON.stringify(usr));
    });
    res.render('result', {title: 'じゃんけん', result: data, user: req.user||'Guest'});
  });
});
module.exports = router;
