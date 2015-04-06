#! /usr/bin/env node

var program = require('commander');
var package = require('../package');

var command = require('./commands/command');
program.version(package.version);

program
  .command('build-history <job>')
  .description('Get build history for job (default to 10 most recent build)')
  .option('-a, --all', 'show build info for all saved builds')
  .option('-s, --show <numberofbuilds>', 'show build info for a given number of saved builds')
  .option('-n, --buildnumber <buildnumber>', 'specific build number to display info for')
  .action(require('./commands/build-history'));

program
  .command('search [term]')
  .description('Search for jobs on the Jenkins server')
  .action(require('./commands/search'));

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
  .command('build <job>')
  .description('Triggers a build for job')
  .action(require('./commands/build'));

program
  .command('config')
  .description('Change configuration options, leave blank to unset ')
  .option('-H, --host [host]', 'specify the Jenkins base url to use')
  .option('-c, --cert [cert]', 'set file path to certificate for accessing the Jenkins host')
  .option('-p, --certPassword [certPassword]', 'set the password for the certificate')
  .action(require('./commands/config').setConfig);

try {
  program.parse(process.argv);
} catch (e) {
  command.error(e);
}

if (!program.args.length) program.help();
