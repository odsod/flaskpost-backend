var
  config = require('./config').sockets
, log = require('./logger')('sockets', 'info')
, io = require('socket.io').listen(config.port)
, db = require('./db')
, seed = require('./seed')
;

io.set('logger', require('./logger')('socket.io', 'error'));
io.set('log level', config.internalLogLevel);

log.info('establishing connection to db...');

db.connect('localhost', 'flaskpost-dev', function () {

  /* ADD DEV BOTTLES */
  db.Bottle.collection.drop(function () {
    log.info('dropped all existing bottles');
    var devBottles = seed.randomNumberedBottles(20);
    var i = devBottles.length;
    var cb = function () {
      log.info('added a dev bottle');
    };
    while (i--) {
      db.Bottle.addBottle(devBottles[i], cb);
    }
  });

  log.info('connection established, waiting for socket connections...');

  io.sockets.on('connection', function (socket) {

    log.info('a client socket has connected');

    socket.on('grabBottles', function (amount, fn) {
      log.info('incoming request for ' + amount + ' bottles');
      db.Bottle.grabBottles(amount, function (bottles) {
        log.info('sending', {
          bottles: bottles
        });
        fn(bottles);
      });
    });

    socket.on('createBottle', function (data, fn) {
      log.info('incoming createBottle', data);
      db.Bottle.createBottle(data, function (err, bottle) {
        log.info('created bottle');
        fn && fn(err);
      });
    });

    socket.on('addTune', function (data, fn) {
      log.info('incoming addTune', data);
      db.Bottle.addTune(data, function (err) {
        log.info('added tune');
        fn && fn(err);
      });
    });
  });

});
