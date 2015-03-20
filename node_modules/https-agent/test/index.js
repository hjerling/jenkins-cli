var httpsAgent = require('..');
var assert = require('assert');

describe('https-agent', function () {
  it('can be instantiated without any options', function () {
    process.env.https_proxy = 'http://cache.example.com';

    var agent = httpsAgent();

    assert(agent);
  });
});