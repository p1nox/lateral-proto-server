var Twitter = require('promised-twit');
var Promise = require('bluebird');

var config  = require('../../config');
var Phone   = require('../models/phone');

var relay = {

  create: function(req, res) {
    var body    = req.body,
        number  = body.number,
        content = body.content;

    return Phone.findOne({number: number})
    .populate('owner')
    .then(function(phone) {

      var twtTokenData = {
        access_token:        config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
      };

      if (phone) {
        var user = phone.owner;
        if (user) {
          twtTokenData = {
            access_token:        user.twitter.token,
            access_token_secret: user.twitter.token_secret
          };
        }
      }

      return twtTokenData;
    })
    .then(function(twtTokenData) {

      var twtUserClient = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token: twtTokenData.access_token,
        access_token_secret: twtTokenData.access_token_secret
      });

      return twtUserClient.postStatusesUpdate({ status: content });
    })
    .then(function(twt) {
      twt = twt || {};
      console.log('[TWITTER] status posted: ', twt.text);

      var data = {};
      res.status(200).send(data);

      return data;
    })
    .catch(function(error) {
      console.log('Error: %j', error);

      res.status(error.status || 400).send(error.message);
      return error;
    });
  }

};

module.exports = relay;
