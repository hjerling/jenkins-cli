var jenkinsapi = require('jenkins-api');
var chalk = require('chalk');
var columnify = require('columnify');
var httpsAgent = require('https-agent');
var _ = require('lodash');
var fs = require('fs');

var cert = fs.readFileSync(process.env.COSMOS_CERT);
var certOpt = {
  cert: cert,
  key: cert
};

var options = {
  // json: true,
  timeout: process.env.COSMOS_TIMEOUT || 10000,
  proxy: false,
  agent: httpsAgent(certOpt)
};


module.exports.api = jenkinsapi.init('https://jenkins.bbc.co.uk', options);

/**
 * Output a collection as a table.
 * @param {array[object]} collection
 */
module.exports.columns = function (collection) {
  if (!_.isArray(collection)) {
    collection = [collection];
  }

  console.log(columnify(collection, {
    columnSplitter: ' | '
  }));
};

/**
 * Log to the console.
 */
module.exports.log = function () {
  console.log.apply(console, arguments);
};

/**
 * Log a success message to the console.
 */
module.exports.success = function () {
  console.log(chalk.green.apply(chalk, arguments));
};

/**
 * Log an info message to the console.
 */
module.exports.info = function () {
  console.log(chalk.yellow.apply(chalk, arguments));
};

/**
 * Print and exit from an error.
 * @param {error} err
 */
module.exports.error = function (err) {
  var message = err;

  if (err instanceof Error) {
    message = err.message;
  }

  console.error(chalk.red(message));
  process.exit(1);
};
