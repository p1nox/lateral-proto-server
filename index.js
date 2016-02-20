var config = require('./config');
var server = require('./server/index.js');

server.listen(config.port, function() {
  console.log('lateral-server listening on port ' + config.port);
});
