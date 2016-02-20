var config = require('../../config.js');
var twilio = require('twilio');

var client = twilio(config.twilio.account_sid, config.twilio.auth_token);

module.exports = client;

// country not enable in edashboard - https://www.twilio.com/user/account/settings/international/sms
// { status: 400,
//   message: 'Permission to send an SMS has not been enabled for the region indicated by the \'To\' number: +56965080435.',
//   code: 21408,
//   moreInfo: 'https://www.twilio.com/docs/errors/21408' }

// wrong token info
// { status: 500,
//   message: 'Internal Server Error',
//   code: 500,
//   moreInfo: 'https://www.twilio.com/docs/errors/500' }
