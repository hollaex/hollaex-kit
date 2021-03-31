'use strict';

const crypto = require('crypto');

const size = parseInt(process.env.RANDOM_SIZE) || 20;
console.log(crypto.randomBytes(size).toString('hex'));