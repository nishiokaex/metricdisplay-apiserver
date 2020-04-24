var express = require ('express');
var passport = require ('passport');
var cors = require ('cors');
var errorhandler = require ('errorhandler');
var GitHubStrategy = require ('passport-github').Strategy;

var app = express ();

var isProduction = process.env.NODE_ENV === 'production';

// passport setting
passport.use (
  new GitHubStrategy (
    {
      clientID: '0a8de1522b3210a8ff2b',
      clientSecret: '0bb47eb313831ce94bcf2e93fa81541b4de10e1c',
      callbackURL: 'https://ajisai.herokuapp.com/api/social/github/callback',
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb (null, profile);
    }
  )
);

passport.serializeUser (function (user, cb) {
  cb (null, user);
});

passport.deserializeUser (function (obj, cb) {
  cb (null, obj);
});

app.set ('port', process.env.PORT || 5000);
app.use (express.static (__dirname + '/public'));

// Configure view engine to render EJS templates.
app.set ('views', __dirname + '/views');
app.set ('view engine', 'ejs');

// クロスオリジン通信の許可
app.use (cors ());

// HTTPリクエストのボディをオブジェクトに変換
app.use (express.json ());
app.use (express.urlencoded ({extended: true}));

app.use (require ('cookie-parser') ());
app.use (
  require ('express-session') ({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use (passport.initialize ());
app.use (passport.session ());

if (!isProduction) {
  app.use (errorhandler ());
}

app.use (require ('./routes'));

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use (function (err, req, res, next) {
    console.log (err.stack);

    res.status (err.status || 500);

    res.json ({
      errors: {
        message: err.message,
        error: err,
      },
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use (function (err, req, res, next) {
  res.status (err.status || 500);
  res.json ({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

// サーバを起動
var server = app.listen (process.env.PORT || 3000, function () {
  console.log ('Listening on port ' + server.address ().port);
});
