#! /usr/bin/env node

var program = require('commander');
var package = require('../package');

var cert = process.env.COSMOS_CERT;
var readmeLink = 'https://github.com/hjerling/jenkins-cli#installation';

if (!cert) return console.error('COSMOS_CERT must be set (See: ' + readmeLink + ')');
var command = require('./commands/command');

program.version(package.version);

program
  .command('latest-build <job>')
  .description('Get build status of job')
  .action(require('./commands/latest-build'));

program
  .command('current-build-progress <job>')
  .description('Get build output for job')
  .action(require('./commands/current-build-progress'));

program
  .command('current-build-progress-bar <job>')
  .description('Get build progress bar for job')
  .action(require('./commands/current-build-progress-bar'));

try {
  program.parse(process.argv);
} catch (e) {
  command.error(e);
}

if (!program.args.length) program.help();
