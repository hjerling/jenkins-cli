var command = require('./command');
var async = require('async');
var moment = require('moment');
var chalk = require('chalk');
var ProgressBar = require('progress');

var bar;
var barOpts = {
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 100
};
var lastTick = 0;
var buildStatus = false;

function tickProgressBar(job, done) {
  command.api.last_build_info(job, function(err, info) {
    if (err) return done(err);

    var percentDone = 100;
    var startTime = moment(info.timestamp);
    var buildTime = moment().diff(startTime);

    percentDone = parseInt((buildTime / info.estimatedDuration) * 100, 10);
    if (percentDone > 100) percentDone = 100;

    bar.tick(percentDone - lastTick);

    lastTick = percentDone;
    buildStatus = info.building;
  });
  done();
}

function printBuildResult(job) {
  command.api.last_build_info(job, function(err, info) {
    if (err) return command.error(err);

    if (info.result === 'SUCCESS') {
      command.success('Build result: ' + info.result);
    } else if (info.result === 'FAILURE') {
      command.error('Build result: ' + info.result);
    } else {
      command.log('Build result: ' + info.result);
    }
  });
}

module.exports = function(job) {
  command.api.last_build_info(job, function(err, buildInfo) {
    if (err) return command.error(err);

    buildStatus = buildInfo.building;
    if (!buildStatus) {
      return command.error(job + ' isn\'t currently building');
    }

    command.log(job + ' (#' + buildInfo.number + ')');
    bar = new ProgressBar('  building [' + chalk.cyan(':bar') + '] :percent', barOpts);

    async.until(
      function() {
        return !buildStatus;
      },
      function(cb) {
        tickProgressBar(job, function(err) {
          if (err) return cb(err);

          setTimeout(cb, 2000);
        });
      },
      function(err) {
        if (err) return command.error(err);
        bar.tick(100);
        printBuildResult(job);
      });
  });
};
