# https-agent

[![Build Status](https://travis-ci.org/robinjmurphy/https-agent.svg)](https://travis-ci.org/robinjmurphy/https-agent)

> HTTPS agent for Node with transparent proxy support

Creates a [HTTPS agent](http://nodejs.org/api/https.html#https_class_https_agent) that automatically handles proxy tunnelling using the `https_proxy` environment variable. You can then plug the agent into your HTTP client of choice and make requests using SSL client authentication.

## Installation

```
npm install https-agent
```

## Usage

```js
var httpsAgent = require('https-agent');
var fs = require('fs');

var agent = httpsAgent({
  pfx: fs.readFileSync('/path/to/client.p12'),
  passphrase: 'client'
});
```

All of the standard [TLS options](http://nodejs.org/api/tls.html#tls_tls_connect_options_callback) are supported when creating an agent. Use the `pfx` and `passphrase` options for a certificate in PKCS12 format or the `cert` and `key` options for separate certificate and key files.

## Examples

### Usage with [`https.get`](http://nodejs.org/api/https.html#https_https_get_options_callback)

```js
var httpsAgent = require('https-agent');
var fs = require('fs');
var https = require('https');

var agent = httpsAgent({
  pfx: fs.readFileSync('/path/to/client.p12'),
  passphrase: 'client'
});

var options = {
  protocol: 'https:',
  hostname: 'www.example.com',
  port: 443,
  agent: agent
}

https.get(options, function (res) {
  res.on('data', function (data) {
    console.log(data.toString());
  });
});
```

### Usage with [request](https://github.com/mikeal/request)

```js
var httpsAgent = require('https-agent');
var fs = require('fs');
var request = require('request');

var agent = httpsAgent({
  pfx: fs.readFileSync('/path/to/client.p12'),
  passphrase: 'client'
});

request('https://www.example.com', {agent: agent, proxy: false}, function (err, res, body) {
  console.log(body);
});
```

### Usage with [node-rest-client](https://github.com/aacerox/node-rest-client)

```js
var httpsAgent = require('https-agent');
var fs = require('fs');
var Client = require('node-rest-client').Client;

var agent = httpsAgent({
  pfx: fs.readFileSync('/path/to/client.p12'),
  passphrase: 'client'
});

var client = new Client({
  connection: {
    agent: agent
  }
});

client.get('https://www.example.com', function (body, res) {
  console.log(body);
});
```
