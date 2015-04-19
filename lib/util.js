// var moment = require('moment');

module.exports.formatDuration = function (duration) {
  var durationString = '';

  if (duration.days() > 0) {
    durationString = durationString + Math.floor(duration.asDays()) + 'd ';
  }
  if (duration.days() > 0 || duration.hours() > 0) {
    durationString = durationString + duration.hours() + 'h ';
  }
  if (duration.hours() > 0 || duration.minutes() > 0) {
    durationString = durationString + duration.minutes() + 'm ';
  }
  durationString = durationString + duration.seconds() + 's';

  return durationString;

};
