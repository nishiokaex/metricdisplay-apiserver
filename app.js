var express = require ('express');
var cors = require ('cors');
var errorhandler = require ('errorhandler');
var app = express ();

var isProduction = process.env.NODE_ENV === 'production';

app.set ('port', process.env.PORT || 5000);
app.use (express.static (__dirname + '/public'));

// クロスオリジン通信の許可
app.use (cors ());

// HTTPリクエストのボディをオブジェクトに変換
app.use (express.json ());
app.use (express.urlencoded ({extended: true}));

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
