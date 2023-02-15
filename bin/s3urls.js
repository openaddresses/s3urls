#!/usr/bin/env node

import s3urls from '../index.js';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

function usage() {
    console.log('s3urls from-url <url>');
    console.log('s3urls to-url <bucket> <key> [--type [s3|bucket-in-path|bucket-in-host]]');
    console.log('s3urls convert <url> [--type [s3|bucket-in-path|bucket-in-host]]');
    console.log('s3urls signed <url> | <bucket> <key> [--expire <seconds>]');
}

function fail(msg) {
    console.error(msg);
    usage();
    process.exit(1);
}

const command = argv._[0];
if (['to-url','from-url', 'convert', 'signed'].indexOf(command) === -1)
    fail('ERROR: Invalid command');

if (command === 'from-url') {
    const url = argv._[1];
    if (!url) fail('ERROR: No url given');

    const result = s3urls.fromUrl(url);
    if (!result.Bucket || !result.Key) fail('ERROR: Unrecognizable S3 url');

    console.log(JSON.stringify(result));
}

if (command === 'to-url') {
    const bucket = argv._[1];
    const key = argv._[2];

    if (!bucket || !key) fail('ERROR: Must specify bucket and key');

    const result = s3urls.toUrl(bucket, key);
    if (argv.type) console.log(result[argv.type]);

    for (const k in result) {
        console.log(result[k]);
    }
}

if (command === 'convert') {
    const url = argv._[1];
    if (!url) fail('ERROR: No url given');
    argv.type = argv.type || 'bucket-in-host';

    const check = s3urls.fromUrl(url);
    if (!check.Bucket || !check.Key) fail('ERROR: Unrecognizable S3 url');

    console.log(s3urls.convert(url, argv.type));
}

if (command === 'signed') {
    const url = argv._.length > 2 ?
        s3urls.toUrl(argv._[1], argv._[2]).s3 :
        s3urls.convert(argv._[1], 's3');

    s3urls.signed(url, argv.expire || 600, (err, signedUrl) => {
        if (err) console.error(err);
        console.log(signedUrl);
    });
}
