var express = require("express");
var router = express.Router();
var db = require("./redis_client");
var async = require("async");
/* API */
router.get("/refresh_records", auth);
function auth(req, res, next) {
  var pass = process.env.REFRESH_PASS || "password";
  if (req.query.password === pass) {
    async.waterfall(
      [
        function(callback) {
          db.hgetall("Match", function(err, matches) {
            callback(null, matches);
          });
        }
      ],
      function(err, matches) {
        db.hgetall("User", function(err, users) {
          for (var key in users) {
            var obj = JSON.parse(users[key]);
            obj.wins = 0;
            obj.losses = 0;
            obj.draws = 0;
            for (var key2 in matches) {
              console.log("log");
              var match = JSON.parse(matches[key2]);
              if (obj.user_name === match.player) {
                if (match.result == 0) {
                  obj.wins++;
                } else if (match.result == 1) {
                  obj.losses++;
                } else if (match.result == 2) {
                  obj.draws++;
                }
              } else {
              }
            }
          }
          db.hset("User", obj.user_name, JSON.stringify(obj));
          res.send(obj);
        });
      }
    );
  } else {
    res.send("失敗");
  }
}
module.exports = router;
