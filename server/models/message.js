var db       = require('mongoose');
var Promise  = require('bluebird');

var Message;

var messageSchema = new db.Schema({
  text:       { type: String },
  owner:      { type: db.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, 'default': Date.now },
});

var Message = db.model('Message', messageSchema);
module.exports = Message;
