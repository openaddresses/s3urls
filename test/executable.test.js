import test from 'tape';
import exec from 'cross-exec-file';
import path from 'node:path';

const cmd = path.resolve(new URL('../bin/s3urls.js', import.meta.url).pathname);

test('bad command', async (t) => {
    try {
        await exec(cmd, ['ham']);
        t.fail();
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: Invalid command'), 'expected message');
    }

    t.end();
});

test('toUrl: bad args', async (t) => {
    try  {
        await exec(cmd, ['to-url']);
        t.fail();
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: Must specify bucket and key'), 'expected message');
    }

    t.end();
});

test('toUrl: all types', async (t) => {
    const expected = [
        's3://bucket/key',
        'https://s3.amazonaws.com/bucket/key',
        'https://bucket.s3.amazonaws.com/key'
    ];

    try {
        const res = await exec(cmd, ['to-url', 'bucket', 'key']);
        res.stdout.trim().split('\n').forEach((url) => {
            t.ok(expected.indexOf(url) > -1, 'expected url');
        });
    } catch (err) {
        t.ifError(err, 'completed');
    }
    t.end();
});

test('toUrl: s3 type', async (t) => {
    const expected = 's3://bucket/key';

    try {
        const res = await exec(cmd, ['to-url', 'bucket', 'key', '--type', 's3']);
        t.equal(res.stdout.trim().split('\n')[0], expected, 'expected url');
    } catch (err) {
        t.ifError(err, 'completed');
    }

    t.end();
});

test('toUrl: bucket-in-path type', async (t) => {
    const expected = 'https://s3.amazonaws.com/bucket/key';

    try {
        const res = await exec(cmd, ['to-url', 'bucket', 'key', '--type', 'bucket-in-path']);
        t.equal(res.stdout.trim().split('\n')[0], expected, 'expected url');
    } catch (err) {
        t.ifError(err, 'completed');
    }

    t.end();
});

test('toUrl: bucket-in-host type', async (t) => {
    const expected = 'https://bucket.s3.amazonaws.com/key';

    try {
        const res = await exec(cmd, ['to-url', 'bucket', 'key', '--type', 'bucket-in-host']);
        t.equal(res.stdout.trim().split('\n')[0], expected, 'expected url');
    } catch (err) {
        t.ifError(err, 'completed');
    }

    t.end();
});

test('fromUrl: no url', async (t) => {
    try {
        await exec(cmd, ['from-url']);
        t.fail();
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: No url given\n', 'expected message'));
    }
    t.end();
});

test('fromUrl: unrecognized url', async (t) => {
    try {
        await exec(cmd, ['from-url', 'http://www.google.com']);
        t.fail();
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: Unrecognizable S3 url\n', 'expected message'));
    }

    t.end();
});

test('fromUrl: success', async (t) => {
    try {
        const res = await exec(cmd, ['from-url', 's3://bucket/key']);
        t.equal(res.stdout, JSON.stringify({
            Bucket: 'bucket',
            Key: 'key'
        }), 'expected result');
    } catch (err) {
        t.error(err);
    }

    t.end();
});

test('convert: no url', async (t) => {
    try {
        await exec(cmd, ['convert']);
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: No url given\n', 'expected message'));
    }

    t.end();
});

test('convert: unrecognized url', async (t) => {
    try {
        await exec(cmd, ['convert', 'http://www.google.com']);
        t.fail();
    } catch (err) {
        t.equal(err[0].code, 1, 'exit 1');
        t.ok(err[0].message.includes('ERROR: Unrecognizable S3 url\n', 'expected message'));
    }

    t.end();
});

test('convert: default success', async (t) => {
    try {
        const res = await exec(cmd, ['convert', 's3://bucket/key']);
        t.equal(res.stdout, 'https://bucket.s3.amazonaws.com/key', 'expected result');
    } catch (err) {
        t.error(err);
    }

    t.end();
});

test('convert: typed success', async (t) => {
    try {
        const res = await exec(cmd, ['convert', 's3://bucket/key', '--type', 'bucket-in-path']);
        t.equal(res.stdout, 'https://s3.amazonaws.com/bucket/key', 'expected result');
    } catch (err) {
        t.error(err);
    }

    t.end();
});
