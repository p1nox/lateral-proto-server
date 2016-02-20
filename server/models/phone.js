var db        = require('mongoose');
var Promise   = require('bluebird');
var randtoken = require('rand-token');

var Phone;

var phoneSchema = new db.Schema({
  number:      { type: String, required: true },
  confirmed:   { type: Boolean, 'default': false },
  secret_code: { type: String,
    default: function() {
      return randtoken.generate(6).toLowerCase();
    }
  },
  owner:       { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at:  { type: Date, 'default': Date.now },
});

var Phone = db.model('Phone', phoneSchema);
module.exports = Phone;
