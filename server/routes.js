var homeController  = require('./controllers/home');
var adminController = require('./controllers/admin');
var phoneController = require('./controllers/phone');
var relayController = require('./controllers/relay');
var receiverController = require('./controllers/receiver');

var authService  = require('./services/auth');
var phoneService = require('./services/phone');

var routes = function(app, passport) {

  app.get('/', homeController.index);

  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/' }), function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/admin');
    });

  app.get('/admin',  authService.isAuthenticated, adminController.index);

  app.get('/phones', authService.isAuthenticated, phoneController.index);
  app.post('/phone', authService.isAuthenticated, phoneService.isValidNumberMiddleware,
    phoneController.create);
  app.post('/phone/confirm', authService.isAuthenticated, phoneService.isValidNumberMiddleware,
    phoneController.confirm);

  app.post('/relay', authService.isValidAppTokens, phoneService.isValidNumberMiddleware,
    relayController.create);

  app.post('/beats', authService.isValidAppTokens, phoneService.isValidNumberMiddleware,
    receiverController.addHeartbeat);

  app.get('/receivers', authService.isValidAppTokens, phoneService.isValidNumberMiddleware,
    receiverController.index);

};

module.exports = routes;


