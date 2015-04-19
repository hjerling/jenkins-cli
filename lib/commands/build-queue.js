var command = require('./command');
var moment = require('moment');
var util = require('../util');

module.exports = function () {
  var jenkins = command.api();
  jenkins.queue(function (err, jobList) {
    if (err) return command.error(err.message);

    var jobs = jobList.items.reverse().map(function (job, index) {
      var queuedSince = moment(job.inQueueSince);
      var queueReason = job.why;

      if (queueReason.length > 40) {
        queueReason = queueReason.substring(0, 40) + '...';
      }
      return {
        number: index + 1,
        name: job.task.name,
        queue_reason: queueReason,
        queued_for: util.formatDuration(moment.duration(moment().diff(queuedSince)))
      };
    });

    command.log('\nBuild Queue contains ' + jobs.length + ' jobs.\n');
    command.columns(jobs);
  });
};
