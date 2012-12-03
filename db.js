var
  config = require('./config').db
, log = require('./logger')('db')
, mongoose = require('mongoose')
, db = mongoose.createConnection(config.address, config.name)
;

db.once('open', function () {
  log.info('mongodb connection open');
});

var Tune = mongoose.Schema({
  uri: String
, location: String
, date: { type: Date, default: Date.now }
});

var Bottle = mongoose.Schema({
  label: String
, random: { type: Number, default: Math.random }
, tunes: [Tune]
});

Bottle.statics.grabBottles = function (amount, fn) {
  var self = this;
  var random = Math.random();
  self
    .find()
    .gt('random', random)
    .limit(amount)
    .exec(function (err, grab1) {
      log.debug('first grab', grab1);
      var remaining = amount - grab1.length;
      if (remaining) {
        self
          .find()
          .lt('random', random)
          .limit(remaining)
          .exec(function (err, grab2) {
            log.debug('second grab', grab2);
            fn(grab1.toObject().concat(grab2.toObject()));
          });
      } else {
        fn(grab1.toObject());
      }
    });
};

Bottle.statics.createBottle = function (data) {
  var
    BottleModel = this
  , TuneModel = this.model('Tune')
  , tune = new TuneModel({
      uri: data.uri
    , location: data.location
    })
  , bottle = new BottleModel({
      label: data.label
    , tunes: [tune]
    })
  ;
  log.debug('saving bottle', bottle);
  bottle.save();
};

Bottle.statics.addTune = function (data) {
  var
    TuneModel = this.model('Tune')
  , tune = new TuneModel({
      uri: data.uri
    , location: data.location
    })
  ;
  log.debug('adding tune', {
    tune: tune
  , bottle: data.id
  });
  this
    .findByIdAndUpdate(data.id, {
      $push: { tunes: tune }
    })
    .exec(function () {});
};

module.exports = {
  Bottle: db.model('Bottle', Bottle)
};
