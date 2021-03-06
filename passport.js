var passport = require('passport');
var db = require('./redis_client');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
passport.use(
  new LocalStrategy(function(username, password, done) {
    db.hget('User', username, function(err, doc) {
      // ここで username と password を確認して結果を返す
      if (err) {
        return done(null, false);
      }
      if (doc) {
        //ハッシュ値を計算して照合
        var shasum = crypto.createHash('sha1');
        shasum.update(password);
        var hash = shasum.digest('hex');
        var obj = JSON.parse(doc);
        if (obj.password == hash) {
          return done(null, {user_name: username, nickname: obj.nickname, description: obj.description});
        } else {
          return done(null, false);
        }
      } else {
        return done(null, false);
      }
    });
  })
);

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});
passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});
module.exports = passport;
