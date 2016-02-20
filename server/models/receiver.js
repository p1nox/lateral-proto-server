var db        = require('mongoose');
var Promise   = require('bluebird');
var Heartbeat   = require('./heartbeat');

var Receiver;

var receiverSchema = new db.Schema({
  number:       { type: String, required: true },
  country_code: { type: String, required: true },
  confirmed:    { type: Boolean, 'default': false },
  active:       { type: Boolean, 'default': false },
  created_at:   { type: Date, 'default': Date.now },
  heartbeats:   [Heartbeat.schema]
});

receiverSchema.methods.addHeartbeat = function(sequence) {
  var heartbeat = new Heartbeat();
  heartbeat.sequence = sequence;

  this.heartbeats.push(heartbeat);
  this.save();

  return heartbeat;
};

var Receiver = db.model('Receiver', receiverSchema);
module.exports = Receiver;

// var r = new Receiver();
//
// r.number = "+569xxxxxxxx";
// r.country_code = "56";
// r.heartbeats = [];
// r.confirmed = true;
// r.active = true;
