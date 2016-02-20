var phoneUtil         = require('google-libphonenumber').PhoneNumberUtil.getInstance(),
    PhoneNumberFormat = require('google-libphonenumber').PhoneNumberFormat;

var phone = {

  // middleware to validate phone number format
  isValidNumberMiddleware: function (req, res, next) {
    var number = phone.isValidAndReturnNumber(req.body.number || req.query.number);
    if (number) {

      if (req.body.number) {
        req.body.number = number;
      }

      if (req.query.number) {
        req.query.number = number;
      }

      return next();
    }

    // if incorrect number format, deny request
    res.status(400).send('Invalid phone number.');
  },

  // phone number format validation
  isValidAndReturnNumber: function (number) {
    try {
      var phone = phoneUtil.parse(number);

      if (phoneUtil.isValidNumber(phone)
          && phone.hasCountryCode()
          && phone.hasNationalNumber()) {

        return phoneUtil.format(phone, PhoneNumberFormat.E164);
      }

      return null;
    } catch(e) {
      return null;
    }
  }

};

module.exports = phone;
