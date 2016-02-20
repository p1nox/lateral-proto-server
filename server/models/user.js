var db       = require('mongoose');
var Promise  = require('bluebird');

var User;

var userSchema = new db.Schema({
  email:      { type: String, lowercase: true },
  user_name:  { type: String },
  name:       { type: String },
  picture:    { type: String },
  twId:       { type: String },
  twitter:    { type: {} },
  created_at: { type: Date, 'default': Date.now },
});

var User = db.model('User', userSchema);
module.exports = User;

// twitter object
// {
//   "_json" : {},
//   "photo" : "https://pbs.twimg.com/profile_images/2255427571/sky_normal.jpg",
//   "name" : "Raul Pino",
//   "user_name" : "p1nox",
//   "token_secret" : "aaa",
//   "token" : "aaa"
// }
