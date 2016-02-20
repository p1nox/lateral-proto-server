var Promise      = require('bluebird');
var express      = require('express');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var cors         = require('cors');
var errorhandler = require('errorhandler');
var mongoose     = require('mongoose');
var session      = require('express-session');
var MongoStore   = require('connect-mongo')(session);
var passport     = require('passport');

var config       = require('../config');
var initPassport = require('./services/passport');

mongoose.Promise = Promise;
mongoose.connect(config.db.url);
mongoose.set('debug', true); // Log all queries that mongoose fire in the application
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

var app = express();

app.use(logger('dev'));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

if (!config.isProduction()) {
  app.use(errorhandler());
}

app.set('views', './server/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/../client/public/'));

/// Initialize Passport
app.use(session({
  secret: 'mySecretKey', // TODO set better key
  store:   new MongoStore({ mongooseConnection: mongoose.connection }),
  saveUninitialized: false, // don't create session until something stored,
  resave:            false // don't save session if unmodified
}));
app.use(passport.initialize());
app.use(passport.session());
initPassport(passport);

require('./routes')(app, passport);

module.exports = app;
