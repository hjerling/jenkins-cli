var command = require('./command');


module.exports = function(job) {

  command.api.last_build_info(job, function(err, result) {
    if (err) command.error(err);
    command.success(result.fullDisplayName + ': ' + result.result);
  });
};
