var _ = require('lodash');
var Promise = require('bluebird');
var phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance(),
    PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;

var config  = require('../../config');
var Receiver = require('../models/receiver');

var receiverController = {

  index: function(req, res) {
    var number = req.query.number,
        phone = phoneUtil.parse(number),
        countryCode = phone.getCountryCode();

    return Receiver.find({country_code: countryCode, confirmed: true, active: true})
    .then(function(receivers) {
      if (!receivers || !receivers.length) {
        return Receiver.find({confirmed: true, active: true});
      }

      return receivers;
    })
    .then(function(receivers){
      var data = _pickIndex(receivers);

      res.status(200).send(data);
    })
    .catch(function(error) {
      console.log('Error: %j', error);

      res.status(error.status || 400).send(error.message);
      return error;
    });

  },

  addHeartbeat: function(req, res) {
    var body    = req.body,
        number  = body.number,
        sequence = body.sequence;

    return Receiver.findOne({number: number, confirmed: true})
    .then(function(receiver) {
      if (!receiver) {
        var error = new Error('Wrong receiver.');
        error.status = 404;
        return Promise.reject(error);
      }

      return receiver.addHeartbeat(sequence);
    })
    .then(function(newHeartbeat) {
      var data = _pickAddHeartbeat(newHeartbeat);

      res.status(200).send(data);
    })
    .catch(function(error) {
      console.log('Error: %j', error);

      res.status(error.status || 400).send(error.message);
      return error;
    });
  }

};


function _pickIndex(receivers) {
  return _.map(receivers, function(r) {
    return _.pick(r, ['number']);
  });
}

function _pickAddHeartbeat(heartbeat) {
  return _.pick(heartbeat, ['sequence', 'time']);
}

module.exports = receiverController;
