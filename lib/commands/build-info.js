var command = require('./command');
var moment = require('moment');

module.exports = function (job, options) {

  command.api.lastBuildInfo(job, function (err, buildInfo) {
    if (err) return command.error(new Error('job ' + job + ' could not be found'));

    var buildNumber = parseInt(options.buildnumber ? options.buildnumber : buildInfo.number);
    command.api.buildInfo(job, buildNumber, function (err, buildInfo) {
      if (err) return command.error(new Error('build #' + buildNumber + ' could not be found'));

      var startTime = moment(buildInfo.timestamp);
      var percentDone = 100;
      var buildTime = 0;

      if (buildInfo.building) {
        buildTime = moment().diff(startTime);

        percentDone = parseInt((buildTime / buildInfo.estimatedDuration) * 100, 10);
        if (percentDone > 100) percentDone = 100;
      }

      var info = {
        name: job,
        build_number: buildInfo.number,
        start_time: startTime.format('DD-MM-YYYY HH:mm:ss'),
        result: buildInfo.result
      };

      if (buildInfo.building) {
        info.result = percentDone + '% done';
      } else if (buildInfo.building && percentDone === 100) {
        info.result = '~100% done';
      }
      command.columns(info);
    });
  });
};
