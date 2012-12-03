var
  config = require('../config').db.test
, expect = require('expect.js')
, log    = require('../logger')('mocha')
, seed   = require('../seed')
, db     = require('../db')
, _      = require('underscore')
;

describe('db', function () {
  before(function (done) {
    db.connect(config.address, config.name, done);
  });

  before(function (done) {
    db.Bottle.collection.drop(function (err) {
      done();
    });
  });

  var dummyBottle = {
    label: seed.randomLabel()
  , tunes: [seed.randomTune()]
  };

  describe('#addBottle()', function () {
    before(function (done)  {
      db.Bottle.addBottle(dummyBottle, done);
    });

    after(function (done) {
      db.Bottle.collection.drop(done);
    });

    it('should persist a new bottle to the database', function () {
      db.Bottle.count().exec(function (err, count) {
        expect(count).to.equal(1);
      });
    });

    describe('the persisted bottle', function () {
      var persistedBottle;
      var persistedTune;

      before(function (done) {
        db.Bottle.findOne().exec(function (err, bottle) {
          expect(bottle).to.be.ok;
          persistedBottle = bottle;
          persistedTune = bottle.tunes[0];
          done();
        });
      });

      it('should have the specified label', function () {
        expect(persistedBottle.label).to.equal(dummyBottle.label);
      });

      it('should contain the specified tune', function () {
        expect(persistedTune).to.be.ok();
        expect(persistedTune.uri).to.equal(dummyBottle.tunes[0].uri);
        expect(persistedTune.location).to.equal(dummyBottle.tunes[0].location);
      });

      it('should have a random number attribute <= 0 && >= 1', function () {
        expect(persistedBottle.random).to.be.a('number');
      });
    });
  });

  describe('#grabBottles()', function () {
    var dummyBottles = seed.randomBottles(5);

    before(function (done) {
      var remaining = dummyBottles.length;
      var saveCallback = function (err) {
        remaining -= 1;
        if (!remaining) {
          done();
        }
      };
      var i = dummyBottles.length;
      while (i--) {
        db.Bottle.addBottle(dummyBottles[i], saveCallback);
      }
    });

    describe('the returned bottles', function () {
      var grabbedBottles;

      before(function (done) {
        db.Bottle.grabBottles(5, function (bottles) {
          grabbedBottles = bottles;
          done();
        });
      });

      it('should be as many as requested', function () {
        expect(grabbedBottles.length).to.be(5);
      });

      it('should all be unique', function () {
        var unique = _.chain(grabbedBottles)
          .pluck('id')
          .unique()
          .value();
        expect(unique.length).to.be(grabbedBottles.length);
      });

      it('should contain the right amount of tunes', function () {
        var tunes = _.chain(grabbedBottles)
          .pluck('tunes')
          .flatten()
          .value();
        expect(tunes.length).to.be(5);
      });

      describe('when there are too few bottles in the database', function () {
        var grabbedBottles;

        before(function (done) {
          db.Bottle.grabBottles(10, function (bottles) {
            grabbedBottles = bottles;
            done();
          });
        });

        it('should be as many as possible', function () {
          expect(grabbedBottles.length).to.be(5);
        });
      });
    });
  });

  describe('#addTune()', function () {
    var dummyBottle = seed.randomBottle();
    var dummyTune = seed.randomTune();
    var existingID;
    var existingBottle;

    before(function (done) {
      db.Bottle.collection.drop(function (err) {
        done();
      });
    });

    before(function (done) {
      db.Bottle.addBottle(dummyBottle, function (err, bottle) {
        existingID = bottle.id;
        expect(existingID).to.be.a('string');
        done();
      });
    });

    before(function (done) {
      db.Bottle.addTune({
        id: existingID
      , tune: dummyTune
      }, done);
    });

    before(function (done) {
      db.Bottle.findById(existingID, function (err, bottle) {
        existingBottle = bottle;
        done();
      });
    });

    it('should add the specified tune to the bottle with the specified id', function (done) {
      expect(existingBottle.tunes[1].uri).to.equal(dummyTune.uri);
      expect(existingBottle.tunes[1].location).to.equal(dummyTune.location);
      done();
    });

  });
});
