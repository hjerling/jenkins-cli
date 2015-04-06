var command = require('./command');
var chalk = require('chalk');

module.exports = function (term) {
  var jenkins = command.api();
  jenkins.jobList(function (err, jobList) {
    if (err) return command.error(err.message);

    var jobs = jobList.jobs;
    if (term) {
      jobs = jobs.filter(function (job) {
        return job.name.indexOf(term) > -1;
      });
    }
    jobs.map(function (job) {
      delete job.url;
      if (job.color.indexOf('anime') > -1) {
        job.build_status = chalk.blue('BUILDING');
      } else if (job.color === 'blue') {
        job.build_status = chalk.green('SUCCESS');
      } else if (job.color === 'red') {
        job.build_status = chalk.red('FAILED');
      } else if (job.color === 'yellow') {
        job.build_status = chalk.yellow('UNSTABLE');
      } else if (job.color === 'disabled') {
        job.build_status = chalk.gray('DISABLED');
      } else if (job.color === 'aborted') {
        job.build_status = chalk.gray.strikethrough('ABORTED');
      } else {
        job.build_status = job.color.toUpperCase();
      }
      delete job.color;
    });

    command.log('\nSearch for \'' + term + '\' gave ' + jobs.length + ' results:\n');

    command.columns(jobs);
  });
};
