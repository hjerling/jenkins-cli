var command = require('./command');

module.exports = function (job) {
  var jenkins = command.api();
  jenkins.lastBuildInfo(job, function (err, buildInfo) {
    jenkins.build(job, function (err, buildResult) {
      if (err) return command.error(err.message);

      if (buildInfo.building) {
        return command.error(job + ' is already building.');
      }

      command.success(buildResult.message);
    });
  });
};
