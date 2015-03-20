var https = require('https');
var tunnel = require('tunnel');
var url = require('url');

module.exports = function (options) {
  options = options || {};
  var proxy = process.env.https_proxy || process.env.HTTPS_PROXY;
  var proxyUrl = proxy ? url.parse(proxy) : {};
  var agent = new https.Agent(options);

  if (proxyUrl.hostname && proxyUrl.protocol) {
    var createTunnel = (proxyUrl.protocol === 'https:') ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;

    options.proxy = {
      host: proxyUrl.hostname,
      port: proxyUrl.port
    };

    agent = createTunnel(options);
  }

  return agent;
};