'use strict';

let dns = require('dns');
let ping = require('ping');
let Promise = require('bluebird');
let pad = require('pad');
let request = require('request');
let fs = require('fs');

let domains = fs.readFileSync('domains.txt').toString().split("\n");

let ouputData = (data) => {
    // console.log(
    //     pad(data.domain, 50) + ' | ' +
    //     pad(data.ip, 20) + ' | ' +
    //     pad(data.ping, 10) + ' | ' +
    //     pad(''+data.status, 10)
    // );
    console.log(data.domain+"\t"+data.ip+"\t"+data.ping+"\t"+data.status);
};

function pingDomain(data) {
    return new Promise((resolve, reject) => {
        if (data.tries >= 5) {
            ouputData(data);
            return resolve();
        }

        data.tries++;

        dns.lookup(data.domain, { family: 4 }, (error1, ip, family) => {
            if (error1) {
                data.ip = 'failed';
                return resolve(pingDomain(data));
            }

            data.ip = ip;

            ping.sys.probe(data.ip, (isAlive) => {

                data.ping = (isAlive ? 'yes' : 'no');

                // TODO: Beautify duplicate code

                request('http://'+data.domain, (error2, response, body) => {
                    if (error2) {
                        request('https://'+data.domain, (error3, response, body) => {
                            if (error3) {
                                data.status = 'failed';
                                ouputData(data);
                                return resolve();
                            }

                            data.status = response.statusCode;
                            ouputData(data);
                            return resolve();
                        });
                    } else {
                        data.status = response.statusCode;
                        ouputData(data);
                        return resolve();
                    }
                });
            });
        });
    });
}

// console.log(pad('Domain', 50)+' | '+pad('Ip', 20)+' | '+pad('Ping', 10)+' | '+pad('Status', 10));
// console.log('-'.repeat(100));

Promise.map(domains, (domain) => {
        let data = { domain: domain, ip: '', ping: '', status: '', tries: 0 };
        return pingDomain(data);
    })
    .then(() => {
        console.log('Done');
    });
