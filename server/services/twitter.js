var Twitter = require('promised-twit');
var config  = require('../../config.js');

// l4t3r4l twitter client
var client = new Twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

module.exports = client;
