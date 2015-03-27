var command = require('./command');

module.exports = function (job) {
  command.api.build(job, function (err, buildResult) {
    if (err) return command.error(err.message);

    command.success(buildResult.message);
  });
};
