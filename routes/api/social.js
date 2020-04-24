var app = require ('express').Router ();
var passport = require ('passport');

app.get ('/', (req, res) => {
  res.render ('login.ejs');
});
app.get ('/github/home', (req, res) => {
  res.render ('github/home.ejs');
});

app.get ('/github', passport.authenticate ('github'));
app.get (
  '/github/callback',
  passport.authenticate ('github', {
    failureRedirect: '/api/social',
  }),
  (req, res) => {
    console.dir (req.user);
    // Successful authentication, redirect home.
    res.redirect ('/api/social/github/home');
  }
);

module.exports = app;
