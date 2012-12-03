module.exports = {
  db: {
    logLevel: 'warn'
  , dev: {
      address: 'localhost'
    , name: 'flaskpost-dev'
    }
  , test: {
      address: 'localhost'
    , name: 'flaskpost-test'
    }
  , prod: {
      address: 'localhost'
    , name: 'flaskpost'
    }
  }
, sockets: {
    port: 3003
  , internalLogLevel: 2
  }
};
