#! /usr/bin/env node

var program = require('commander');
var package = require('../package');

var cert = process.env.COSMOS_CERT;
var readmeLink = 'https://github.com/hjerling/jenkins-cli#installation';

if (!cert) return console.error('COSMOS_CERT must be set (See: ' + readmeLink + ')');
var command = require('./commands/command');

program.version(package.version);

program
  .command('build-info <job>')
  .description('Get build status of job')
  .option('-n, --buildnumber <buildnumber>', 'specific build number to display info for')
  .action(require('./commands/build-info'));

program
  .command('build-output <job>')
  .description('Get build output for job')
  .option('-n, --buildnumber <buildnumber>', 'specific build number to display output for')
  .action(require('./commands/build-output'));

program
  .command('build-progress <job>')
  .description('Get build progress bar for job')
  .action(require('./commands/build-progress'));

program
  .command('build-history <job>')
  .description('Get build history for job')
  .option('-a, --all', 'show build info for all saved builds')
  .action(require('./commands/build-history'));

try {
  program.parse(process.argv);
} catch (e) {
  command.error(e);
}

if (!program.args.length) program.help();
