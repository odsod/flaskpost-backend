var
  config = require('./config').db
, log = require('./logger')('db', config.logLevel)
, mongoose = require('mongoose')
;

var Bottle = mongoose.Schema({
  label: String
, random: { type: Number, default: Math.random }
, tunes: [{
    uri: String
  , location: String
  , date: { type: Date, default: Date.now }
  }]
});

Bottle.statics.grabBottles = function (amount, fn) {
  var self = this;
  var random = Math.random();
  self
    .find()
    .gt('random', random)
    .limit(amount)
    .exec(function (err, grab1) {
      log.info('first grab', grab1);
      var remaining = amount - grab1.length;
      if (remaining) {
        self
          .find()
          .lt('random', random)
          .limit(remaining)
          .exec(function (err, grab2) {
            log.info('second grab', grab2);
            fn(grab1.concat(grab2));
          });
      } else {
        fn(grab1);
      }
    });
};

Bottle.statics.addBottle = function (data, fn) {
  var
    BottleModel = this
  , bottle = new BottleModel({
      label: data.label
    })
  ;
  var i = data.tunes.length;
  while (i--) {
    bottle.tunes.push(data.tunes[i]);
  }
  log.info('saving bottle', bottle);
  bottle.save(fn);
};

Bottle.statics.addTune = function (data, fn) {
  log.info('adding tune', {
    tune: data.tune
  , bottle: data.id
  });
  this
    .findByIdAndUpdate(data.id, {
      $push: { tunes: data.tune }
    })
    .exec(fn);
};

exports.connect = function (address, name, fn) {
  var db = mongoose.createConnection(address, name);

  db.once('open', function () {
    log.info('mongodb connection open');
    fn && fn();
  });

  exports.Bottle = db.model('Bottle', Bottle);
};
