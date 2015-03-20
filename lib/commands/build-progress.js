var command = require('./command');
var async = require('async');
var buildStatus = false;


function printMessage(line) {
  command.log(line);
}

module.exports = function(job) {

  command.api.last_build_info(job, function(err, buildInfo) {
    if (err) return command.error(err);

    buildStatus = buildInfo.building;
    if (!buildStatus) {
      return command.error(job + ' isn\'t currently building');
    }

    var _linesRead = 0;
    async.until(
      function() {
        return !buildStatus;
      },
      function(cb) {
        async.series([
          function printLatestOutput(done) {
            command.api.job_output(job, buildInfo.number, function(err, output) {
              if (err) return done(err);

              var lines = output.output.split(/\r\n|\r|\n/);

              var linesToPrint = lines.slice(_linesRead, lines.length - 1);
              if (linesToPrint.length > 1) {
                linesToPrint.forEach(printMessage);
            _linesRead = lines.length - 1;
              }
            });
            done();
          },
          function getBuildStatus(done) {
            command.api.last_build_info(job, function(err, buildInfo) {
              if (err) return done(err);

              buildStatus = buildInfo.building;
            });
            done();
          }
        ], function(err) {
          if (err) return cb(err);

          // console.log('sleep');
          setTimeout(cb, 2000);
        });
      },
      function(err) {
        if (err) return command.error(err);
      }
    );
  });
};
