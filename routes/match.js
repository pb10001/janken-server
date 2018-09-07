var express = require('express');
var router = express.Router();
var moment = require('moment');
var db = require('../redis_client');
var util = require('../util');

router.get('/', function(req, res) {
  res.render('match', { title: 'じゃんけん', user: req.user || 'Guest' });
});
router.post('/result', function(req, res) {
  var max = -1;
  db.hgetall('Match', function(err, docs) {
    var count = 0;
    for (var key in docs) {
      var obj = JSON.parse(docs[key]);
      var offset = (moment().utcOffset("+9:00") - moment(obj.date))/1000/60/60/24;
      console.log(offset);
      if(obj.player===req.user.user_name && offset < 1.0) count++;
      if (obj.id > max) {
        max = obj.id;
      }
    }
    if(count >= 10){
      res.send("1日の対戦数を超えました。");
      return;
    }
    var playerHand = util.hand2num(req.body['hand']);
    var robotHand = Math.floor(Math.random() * 3);
    var result = util.winner(playerHand, robotHand);
    var data = {
      id: max + 1,
      player: req.user.user_name,
      result: result,
      player_hand: playerHand,
      player_hand_str: util.num2hand(playerHand),
      robot_hand: robotHand,
      robot_hand_str: util.num2hand(robotHand),
      date: moment()
        .utcOffset('+09:00')
        .format('YYYY/MM/DD HH:mm:ss')
    };
    db.hset('Match', data.id, JSON.stringify(data));
    db.hget('User', req.user.user_name, function(err, doc) {
      var usr = JSON.parse(doc);
      if (result == 0) usr.wins++;
      if (result == 2) usr.draws++;
      if (result == 1) usr.losses++;
      db.hset('User', req.user.user_name, JSON.stringify(usr));
    });
    res.render('result', {
      title: 'じゃんけん',
      result: data,
      user: req.user || 'Guest'
    });
  });
});
module.exports = router;
