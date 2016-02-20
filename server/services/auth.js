var config  = require('../../config');

var auth = {

  // middleware for user auth valdiation
  isAuthenticated: function (req, res, next) {
    // if user is authenticated in the session, call the next()
    // to call the next request handler
    // Passport adds this method to request object.
    // A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated()) {
      return next();
    }
    // if the user is not authenticated then redirect him to the home page
    res.redirect('/');
  },

  // middleware for app tokens validation
  isValidAppTokens: function (req, res, next) {
    var app    = req.get('x-app-token'),
        secret = req.get('x-secret-token');

    // continue if request contains valid app tokens
    if (config.app.token === app && config.app.secret === secret) {
      return next();
    }

    // if incorrect tokens, deny request
    res.status(403).send('Permission denied.');
  },

};

module.exports = auth;
