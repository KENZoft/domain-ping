'use strict';

const Promise = require('bluebird');
const ping = require('ping');
const request = require('request');

const dns = require('dns');

const getDomainIp = (domain) => {
    return new Promise((resolve, reject) => {
        dns.lookup(domain, { family: 4 }, (error, ip, family) => {
            if (error) {
                return reject(error);
            }
            return resolve(ip);
        });
    });
};

const pingIp = (ip) => {
    return new Promise((resolve, reject) => {
        ping.sys.probe(ip, (alive) => {
            return resolve(alive);
        });
    });
};

const requestUrl = (url) => {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            return resolve(response.statusCode);
        });
    });
};

const requestDomain = (domain) => {
    return new Promise((resolve, reject) => {
        requestUrl('http://'+domain)
            .then(resolve)
            .catch((error) => {
                requestUrl('https://'+domain)
                    .then(resolve)
                    .catch(reject);
            })
    });
};

const domainPing = (domain) => {
    return new Promise((resolve, reject) => {
        let data = {
            domain: domain
        };

        getDomainIp(domain)
            .then((ip) => {
                data.ip = ip;
                return pingIp(ip);
            })
            .then((alive) => {
                data.ping = alive;
                return requestDomain(domain);
            })
            .then((statusCode) => {
                data.online = (statusCode === 200);
                data.statusCode = statusCode;
                data.success = true;
                return resolve(data);
            })
            .catch((error) => {
                data.success = false;
                data.error = error;
                return reject(data);
            });
    });
};

module.exports = domainPing;
