var
  config = require('./config').sockets
, log = require('./logger')('sockets')
, io = require('socket.io').listen(config.port)
, db = require('./db');

io.sockets.on('connection', function (socket) {
  socket.on('requestBottles', function (data, fn) {
    log.info('incoming requestBottles', data);
    db.Bottle.grabBottles(data.amount, fn);
  });

  socket.on('createBottle', function (data) {
    log.info('incoming createBottle', data);
    db.Bottle.createBottle(data);
  });

  socket.on('addTune', function (data) {
    log.info('incoming addTune', data);
    db.Bottle.addTune(data);
  });
});
