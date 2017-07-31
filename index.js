'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');
let pad = require('pad');
let request = require('request');
let fs = require('fs');

let domains = fs.readFileSync('domains.txt').toString().split("\n");

function pingDomain(domain) {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, (error, ip, family) => {
            if (error) { return reject(error); }
            ping.sys.probe(ip, (isAlive) => {
                request('http://'+domain, (error2, response, body) => {
                    if (error2) { return reject(error2); }
                    console.log(pad(domain, 50)+' | '+pad(ip, 20)+' | '+pad((isAlive ? 'yes' : 'no'), 10)+' | '+pad(''+response.statusCode, 10));
                    return resolve();
                });
            });
        });
    });
}

console.log(pad('Domain', 50)+' | '+pad('Ip', 20)+' | '+pad('Ping', 10)+' | '+pad('Status', 10));
console.log('-'.repeat(100));

Promise.map(domains, (domain) => {
        return pingDomain(domain);
    })
    .then(() => {
        console.log('Done');
    });
