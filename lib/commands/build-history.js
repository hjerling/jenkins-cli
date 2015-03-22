var command = require('./command');
var moment = require('moment');
var async = require('async');
var chalk = require('chalk');

function getBuildInfo(job, buildNumber, cb) {
  // console.log(typeof buildNumber);
  // console.log(buildNumber);
  command.api.build_info(job, buildNumber, function (err, buildInfo) {
    // console.log(buildInfo);
    if (err) return cb(new Error('build #' + buildNumber + ' could not be found'));

    var startTime = moment(buildInfo.timestamp);
    var percentDone = 100;
    var buildTime = 0;

    if (buildInfo.building) {
      buildTime = moment().diff(startTime);

      percentDone = parseInt((buildTime / buildInfo.estimatedDuration) * 100, 10);
      if (percentDone > 100) percentDone = 100;
    }
    var info = {
      build_number: buildInfo.number,
      start_time: startTime.format('DD-MM-YYYY HH:mm:ss'),
      result: buildInfo.result
    };

    if (buildInfo.building) {
      info.result = percentDone + '% done';
    } else if (buildInfo.building && percentDone === 100) {
      info.result = '~100% done';
    }

    if (info.result === 'SUCCESS') {
      info.result = chalk.green(info.result);
    } else if (info.result === 'FAILURE') {
      info.result = chalk.red(info.result);
    }

    cb(null, info);
  });
}

module.exports = function (job, options) {
  var showAll = options.all;

  command.api.job_info(job, function (err, jobInfo) {
    if (err) return command.error('Could not find job ' + job);

    var builds = jobInfo.builds;
    if (!showAll) {
      builds = jobInfo.builds.splice(0, 10);
    }

    async.map(builds, function (build, done) {
        getBuildInfo(job, build.number, function (err, info) {
          if (err) done(err);
          done(null, info);
        });
      },
      function (err, buidlHistory) {
        if (err) command.error(err.message);
        command.log('\n' + job + ' build history:\n');
        command.columns(buidlHistory);
      });
  });
};
