var
  winston = require('winston')
, Logger  = winston.Logger
, Console = winston.transports.Console;

var
  DEFAULT_LEVEL  = 'info'
, OVERRIDE_LEVEL = null;

module.exports = function (namespace, level) {
  var logger = new Logger({
    levels: winston.config.cli.levels
  , colors: winston.config.cli.colors
  , transports: [
      new Console({
        level: OVERRIDE_LEVEL || level || DEFAULT_LEVEL
      , colorize: true
      , timestamp: function () {
          return namespace;
        }
      })
    ]
  });
  logger.data = function (data) {
    this.debug(JSON.stringify(data, null, '  '));
  };
  return logger;
};
