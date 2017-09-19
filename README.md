# Domain Ping

[![NPM](https://nodei.co/npm/domain-ping.png)](https://nodei.co/npm/domain-ping/)

[![Build Status](https://travis-ci.org/ricardonunesdev/domain-ping.svg?branch=master)](https://travis-ci.org/ricardonunesdev/domain-ping)
[![Coverage Status](https://coveralls.io/repos/github/ricardonunesdev/domain-ping/badge.svg?branch=master)](https://coveralls.io/github/ricardonunesdev/domain-ping?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/ricardonunesdev/domain-ping.svg)](https://gemnasium.com/github.com/ricardonunesdev/domain-ping)
[![npm](https://img.shields.io/npm/v/domain-ping.svg)](https://www.npmjs.com/package/domain-ping)
[![npm](https://img.shields.io/npm/l/domain-ping.svg)](https://github.com/ricardonunesdev/domain-ping/blob/master/LICENSE)

A small Node.js module that attempts to ping a domain.

It does the following:

 - Fetches the domain's IP address from the DNS records
 - Checks if the server is responding to ping requests for that IP address
 - Checks if the server is responding to HTTP requests for that domain

When done, it returns an object with the gathered data (check Usage below).

## Installation

To install the package, run this inside your project's folder.

```sh
$ npm install domain-ping --save
```

## Usage

The module exports a Promise that must be handled on your side.

```js
const domainPing = require("domain-ping");

domainPing('github.com') // Insert the domain you want to ping
    .then((res) => {
        console.log(res); // Replace with your code
    })
    .catch((error) => {
        console.error(error);
    });
```

This example should output an object like this:

```js
{ domain: 'github.com',
  ip: '192.30.253.112',
  ping: true,
  online: true,
  statusCode: 200,
  success: true }
```

Where:

 - `domain` is the domain you requested
 - `ip` is the IP address the domain should be pointing to, as defined in the DNS server by an A record
 - `ping` is true if the server is responding to ping requests, false otherwise (false does not mean it's down, ICMP could be blocked on the server's firewall)
 - `online` is true if the server is responding to HTTP requests for the chosen domain, with status code = 200, false otherwise
 - `statusCode` is the actual status code replied by the server in the HTTP request (200, 404, 503, etc)
 - `success` is true if the entire process executed correctly, false otherwise (check Errors below)

## Errors

In case of error, the output should look like this:

```js
{ domain: 'githubabc.com',
  success: false,
  error: 'getaddrinfo ENOTFOUND githubabc.com' }
```

Where:

 - `error` is the actual message generated by the original error when it occurred, in the example above the domain `githubabc.com` doesn't appear to have an A record on the DNS server

## Feedback

All bug reports and feature requests are welcome, and should be submitted as issues [here](https://github.com/ricardonunesdev/domain-ping/issues).

## License

MIT © [Ricardo Nunes](https://github.com/ricardonunesdev)
