var command = require('./command');
var async = require('async');

module.exports = function (job, buildNumber) {
  var jenkins = command.api();

  async.waterfall([
    function determinBuildnumber(done) {
        if (!buildNumber) {
          jenkins.lastBuildInfo(job, function (err, buildInfo) {
            if (err) return done(err);

            done(null, buildInfo.number);
          });
        } else {
          done(null, buildNumber);
        }
    }
  ],
    function stopBuild(err, buildNumber) {
      if (err) return command.error(err);
      jenkins.stopBuild(job, buildNumber, function (err, buildResult) {
        if (err) return command.error(err);

        command.success(buildResult.message);
      });
    });
};
