var command = require('./command');
var async = require('async');
var buildStatus = true;

function printMessage(line) {
  command.log(line);
}

module.exports = function (job, options) {
  command.api.lastBuildInfo(job, function (err, buildInfo) {
    if (err) return command.error(new Error('job ' + job + ' could not be found'));

    var buildNumber = parseInt(options.buildnumber ? options.buildnumber : buildInfo.number);
    var _linesRead = 0;
    async.until(
      function () {
        return !buildStatus;
      },
      function (cb) {
        async.series([
          function printLatestOutput(done) {
            command.api.buildOutput(job, buildNumber, function (err, output) {
              if (err) return done(new Error('build #' + buildNumber + ' could not be found'));

              var lines = output.consoleText.split(/\r\n|\r|\n/);

              var linesToPrint = lines.slice(_linesRead, lines.length - 1);
              if (linesToPrint.length > 1) {
                linesToPrint.forEach(printMessage);
                _linesRead = lines.length - 1;
              }
            });
            done();
          },
          function getBuildStatus(done) {
            command.api.buildInfo(job, buildNumber, function (err, buildInfo) {
              if (err) return done(new Error('build #' + buildNumber + ' could not be found'));

              buildStatus = buildInfo.building;
            });
            done();
          }
        ], function (err) {
          if (err) return cb(err);

          setTimeout(cb, 2000);
        });
      },
      function (err) {
        if (err) return command.error(err);
      }
    );
  });
};
