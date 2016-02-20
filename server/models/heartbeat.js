var db        = require('mongoose');
var Promise   = require('bluebird');

var Heartbeat;

var heartbeatSchema = new db.Schema({
  sequence: { type: String, required: true },
  time:     { type: Date, 'default': Date.now },
});

var Heartbeat = db.model('Heartbeat', heartbeatSchema);
module.exports = Heartbeat;
