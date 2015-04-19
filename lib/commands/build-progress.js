var command = require('./command');
var async = require('async');
var moment = require('moment');
var chalk = require('chalk');
var ProgressBar = require('progress');
var util = require('../util');

var jenkins;
var bar;
var barOpts = {
  title: 'building',
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100
};
var lastTick = 0;
var buildStatus = false;

function getLatesBuildNumber(job, cb) {
  jenkins.lastBuildInfo(job, function (err, info) {
    if (err) cb(new Error('Could not find job ' + job));

    cb(null, info.number);
  });
}

function tickProgressBar(job, buildNumber, done) {
  jenkins.buildInfo(job, buildNumber, function (err, info) {
    if (err) return done(err);

    var percentDone = 100;
    var startTime = moment(info.timestamp);
    var buildTime = moment().diff(startTime);
    var estimatedTimeDone = startTime.add(moment(info.estimatedDuration));
    var etd = util.formatDuration(moment.duration(estimatedTimeDone.diff(moment())));
    var runningFor = util.formatDuration(moment.duration(buildTime));

    percentDone = parseInt((buildTime / info.estimatedDuration) * 100, 10);

    if (bar.curr <= 98 && percentDone <= 99) {
      bar.tick(percentDone - lastTick, {
        duration: 'eta: ' + etd,
        runningFor: '(started ' + runningFor + ' ago)'
      });
    } else if (percentDone > 99) {
      bar.tick(99 - bar.curr, {
        duration: 'still building...',
        runningFor: '(started ' + runningFor + ' ago)'
      });
    }
    lastTick = percentDone;

    buildStatus = info.building;
  });
  done();
}

function printBuildResult(job, buildNumber) {
  jenkins.buildInfo(job, buildNumber, function (err, info) {
    if (err) return command.error(err);
    var opts = {
      runningFor: ''
    };
    if (info.result === 'SUCCESS') {
      opts.duration = 'Build result: ' + chalk.green(info.result);
    } else if (info.result === 'FAILURE') {
      opts.duration = 'Build result: ' + chalk.red(info.result);
    } else {
      opts.duration = 'Build result: ' + info.result;
    }
    bar.tick(100 - bar.curr, opts);
  });
}

module.exports = function (job) {
  jenkins = command.api();
  getLatesBuildNumber(job, function (err, buildNumber) {
    if (err) command.error('Could not find job ' + job);

    jenkins.buildInfo(job, buildNumber, function (err, buildInfo) {
      if (err) return command.error(err);

      buildStatus = buildInfo.building;
      if (!buildStatus) {
        return command.error(job + ' isn\'t currently building');
      }
      command.log(job + ' (#' + buildInfo.number + ')');
      bar = new ProgressBar(' building [' + chalk.cyan(':bar') + '] :percent :duration :runningFor', barOpts);

      async.until(
        function () {
          return !buildStatus;
        },
        function (cb) {
          tickProgressBar(job, buildNumber, function (err) {
            if (err) return cb(err);

            setTimeout(cb, 2000);
          });
        },
        function (err) {
          if (err) return command.error(err);
          printBuildResult(job, buildNumber);
        });
    });
  });
};
