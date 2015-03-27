var command = require('./command');
var moment = require('moment');
var async = require('async');
var chalk = require('chalk');

function getBuildInfo(job, buildNumber, cb) {
  command.api.buildInfo(job, buildNumber, function (err, buildInfo) {
    if (err) return cb(err);

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
  var show = options.show;
  var buildNumber = parseInt(options.buildnumber);

  command.api.jobInfo(job, function (err, jobInfo) {
    if (err) return command.error(err.message);

    var builds = jobInfo.builds;
    if (show && !showAll && !buildNumber) {
      builds = jobInfo.builds.splice(0, show);
    } else if (!show && !showAll && buildNumber) {
      builds = [
        {
          number: buildNumber
        }
      ];
    } else if (!show && !showAll && !buildNumber) {
      builds = jobInfo.builds.splice(0, 10);
    } else
    if (!show && showAll && !buildNumber) {
      //NO OPS - Don't filter the list (show all)
    } else {
      command.error('Invalid combination of arguments');
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
