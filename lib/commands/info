var command = require('./command');
var async = require('async');
var config = require('./config');
var jenkins;

module.exports = function () {
  jenkins = command.api();
  async.parallel({
      config: function (done) {
        done(null, config.getConfig());
      },
      jobs: function (done) {
        jenkins.jobList(function (err, jobList) {
          if (err) return done(err);

          var jobsBuilding = jobList.jobs.filter(function (job) {
            return job.color.indexOf('anime') > -1;
          });

          var jobs = {
            numberOfJobs: jobList.jobs.length,
            numberOfJobsBuilding: jobsBuilding.length
          };
          done(null, jobs);
        });
      },
      buildQueue: function (done) {
        jenkins.queue(function (err, buildQueue) {
          if (err) return done(err);

          done(null, buildQueue.items.length);
        });
      }
    },
    function (err, results) {
      command.log('Information about Jenkins Server:');
      command.log('  Host: ' + results.config.host);
      if (results.config.cert) {
        command.log('    Cert: ' + results.config.cert);
        if (results.config.certPassword) {
          command.log('    Password: ·········');
        }
      }
      command.log('  Jobs: ' + results.jobs.numberOfJobs + ' (' + results.jobs.numberOfJobsBuilding + ' building)');
      command.log('  Build Queue: ' + results.buildQueue);
    });
};
