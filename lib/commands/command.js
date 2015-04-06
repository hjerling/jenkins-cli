var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var chalk = require('chalk');
var columnify = require('columnify');
var httpsAgent = require('https-agent');
var Jenkins = require('node-jenkins');
var config = require('./config');

function validateOptions(options) {
  if (!options.host) {
    error('The Jenkins host URL is not set.\n' +
      '  Use \'jenkins config --host <jenkins_url> \' to set it.');
  }

  if (path.extname(options.cert) === '.p12') {
    if (!options.certPassword) {
      var errorMessage = 'You have set a certificate of type \'p12\' but not set a password.\n' +
        '  Use \'jenkins config --certPassword <password>\' to set it.';

      error(errorMessage);
    }
  }
}

function buildCertOpts(config) {
  var cert = fs.readFileSync(config.cert);

  if (path.extname(config.cert) === '.p12') {
    return {
      pfx: fs.readFileSync(config.cert),
      passphrase: config.certPassword
    };
  }

  return {
    cert: cert,
    key: cert
  };
}

/**
 * Creates the API object for use
 * within commands.
 */
function api() {
  var options = config.getConfig();
  validateOptions(options);

  if (options.cert) {
    options.agent = httpsAgent(buildCertOpts(options));
  }
  return new Jenkins(options.host, options);
}

/**
 * Output a collection as a table.
 * @param {array[object]} collection
 */
function columns(collection) {
  if (!_.isArray(collection)) {
    collection = [collection];
  }

  console.log(columnify(collection, {
    columnSplitter: ' | '
  }));
}

/**
 * Log to the console.
 */
function log() {
  console.log.apply(console, arguments);
}

/**
 * Log a success message to the console.
 */
function success() {
  console.log(chalk.green.apply(chalk, arguments));
}

/**
 * Log an info message to the console.
 */
function info() {
  console.log(chalk.yellow.apply(chalk, arguments));
}

/**
 * Print and exit from an error.
 * @param {error} err
 */
function error(err) {
  var message = err;

  if (err instanceof Error) {
    message = err.message;
  }

  console.error(chalk.red(message));
  process.exit(1);
}

module.exports = {
  api: api,
  columns: columns,
  log: log,
  success: success,
  info: info,
  error: error
};
