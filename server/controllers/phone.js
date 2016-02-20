var _       = require('lodash');
var Promise = require('bluebird');

var config = require('../../config');
var Phone  = require('../models/phone');
var twilio = require('../services/twilio');

var TWILIO_NUMBER = config.twilio.from_number;

var phoneNumber = {

  index: function(req, res) {
    var user = req.user;

    return Phone.find({owner: user._id})
    .then(function(phones) {

      var data = {phones: _pickPhonesRes(phones)};
      res.status(200).send(data);

      return data;
    });
  },

  create: function(req, res) {
    var user = req.user,
      number = req.body.number;

    var newPhone = new Phone({owner: user, number: number});

    return newPhone.save()
    .then(function(phone) {

      var smsData = {
        to: number,
        from: TWILIO_NUMBER,
        body: 'Welcome to Lateral, your confirmation code is: ' + phone.secret_code
      };

      if ( config.isProduction() ) {
        // send message without waiting
        twilio.sendSms(smsData, _logIfError);
      }
      console.log("[TWILIO] Message sent: ", smsData);

      var data = {phone: _pickPhoneRes(phone)};
      res.status(200).send(data);

      return data;
    });
  },

  confirm: function(req, res) {
    var user = req.user,
      number = req.body.number,
      secret_code = req.body.secret_code;

    return Phone.findOne(
      {owner: user._id, number: number, secret_code: secret_code},
      {number: 1, secret: 1, confirmed: 1}
    )
    .then(function(phone) {
      if (!phone) {
        var error = new Error('Wrong secret number.');
        error.status = 404;
        return Promise.reject(error);
      }

      // updating without waiting
      phone.confirmed = true;
      phone.save();

      var data = _pickPhoneRes(phone);
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

module.exports = phoneNumber;

function _pickPhoneRes(phone){
  return _.pick(phone, ['_id', 'number', 'confirmed']);
}

function _pickPhonesRes(phones) {
  return _.map(phones, function(p){
    return _pickPhoneRes(p);
  });
}

function _logIfError(error, message) {
  if (error) {
    console.log("[TWILIO] Error: %j" + error);
  }
}
