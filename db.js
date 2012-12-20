var
  config = require('./config').db
, log = require('./logger')('db', 'debug')
, mongoose = require('mongoose')
;

function cleanTunes(arr) {
  return arr.map(function (t) {
    return {
      uri: t.uri
    };
  });
}

function cleanBottles(arr) {
  return arr.map(function (b) {
    return {
      id: b._id
    , label: b.label
    , tunes: cleanTunes(b.tunes)
    };
  });
}

var Bottle = mongoose.Schema({
  label: String
, random: { type: Number, default: Math.random, index: true }
, tunes: [{
    uri: String
  , location: String
  , date: { type: Date, default: Date.now }
  }]
});

Bottle.statics.grabBottles = function (amount, fn) {
  var self = this;
  var random = Math.random();
  log.debug('performing query for bottles with random > ' + random);
  self
    .find()
    .gte('random', random)
    .limit(amount)
    .exec(function (err, grab1) {
      if (err) {
        log.error('error in first grab query: ', err);
        fn([]);
      } else {
        grab1 = grab1 || [];
        grab1 = cleanBottles(grab1);
        log.debug('returned from query with', {
          bottles: grab1
        });
        var remaining = amount - grab1.length;
        if (remaining) {
          log.debug('performing query for bottles with random < ' + random);
          self
            .find()
            .lte('random', random)
            .limit(remaining)
            .exec(function (err, grab2) {
              if (err) {
                log.error('error in 2:nd grab query: ', err);
                fn([]);
              } else {
                grab2 = grab2 || [];
                grab2 = cleanBottles(grab2);
                log.debug('returned from query with', {
                  bottles: grab2
                });
                fn(grab1.concat(grab2));
              }
            });
        } else {
          fn(grab1);
        }
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
