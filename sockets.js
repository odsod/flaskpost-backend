var
  config = require('./config').sockets
, log = require('./logger')('sockets')
, io = require('socket.io').listen(config.port)
, db = require('./db');

io.set('logger', require('./logger')('socket.io'));
io.set('log level', config.internalLogLevel);

io.sockets.on('connection', function (socket) {
  socket.on('requestBottles', function (data, fn) {
    log.info('incoming requestBottles', data);
    db.Bottle.grabBottles(data.amount, function (err, bottles) {
      log.info('sending bottles', bottles);
    });
  });

  socket.on('createBottle', function (data) {
    log.info('incoming createBottle', data);
    db.Bottle.createBottle(data, function (err, bottle) {
      log.info('created bottle');
    });
  });

  socket.on('addTune', function (data) {
    log.info('incoming addTune', data);
    db.Bottle.addTune(data, function (err) {
      log.info('added tune');
    });
  });
});
