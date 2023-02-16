import test from 'tape';
import s3Urls from '../index.js';

test('toUrl', (t) => {
    const result = s3Urls.toUrl('bucket', 'key');
    t.equal(result.S3, 's3://bucket/key', 'expected s3 url');
    t.equal(result['BucketInPath'], 'https://s3.amazonaws.com/bucket/key', 'expected BucketInPath url');
    t.equal(result['BucketInHost'], 'https://bucket.s3.amazonaws.com/key', 'expected BucketInHost url');
    t.end();
});

test('fromUrl: unrecognized url', (t) => {
    const result = s3Urls.fromUrl('http://www.google.com');
    t.notOk(result.Bucket, 'no bucket');
    t.notOk(result.Key, 'no key');
    t.end();
});

test('fromUrl: s3 style', (t) => {
    const result = s3Urls.fromUrl('s3://bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: s3 style - dot', (t) => {
    const result = s3Urls.fromUrl('s3://results.openaddresses.io/the/whole/key');
    t.equal(result.Bucket, 'results.openaddresses.io', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: s3 bucket only style', (t) => {
    const result = s3Urls.fromUrl('s3://bucket');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, '', 'expected key');
    t.end();
});

test('fromUrl: s3 bucket only style with slash', (t) => {
    const result = s3Urls.fromUrl('s3://bucket/');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, '', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath style', (t) => {
    const result = s3Urls.fromUrl('https://s3.amazonaws.com/bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath style in cn-north-1', (t) => {
    const result = s3Urls.fromUrl('https://s3.cn-north-1.amazonaws.com.cn/bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath style in cn-north-1 w/ dot bucket', (t) => {
    const result = s3Urls.fromUrl('https://s3.cn-north-1.amazonaws.com.cn/results.openaddresses.io/the/whole/key');
    t.equal(result.Bucket, 'results.openaddresses.io', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath style in ap-southeast-1', (t) => {
    const result = s3Urls.fromUrl('https://s3.ap-southeast-1.amazonaws.com/bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath dashed in cn-north-1', (t) => {
    const result = s3Urls.fromUrl('https://s3-cn-north-1.amazonaws.com.cn/bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInPath dashed in ap-southeast-1', (t) => {
    const result = s3Urls.fromUrl('https://s3-ap-southeast-1.amazonaws.com/bucket/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3.amazonaws.com/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in cn-north-1 w/ dot', (t) => {
    const result = s3Urls.fromUrl('https://results.openaddresses.io.s3.cn-north-1.amazonaws.com.cn/the/whole/key');
    t.equal(result.Bucket, 'results.openaddresses.io', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in cn-north-1 w/ dot & s3', (t) => {
    const result = s3Urls.fromUrl('https://results.s3llout-to-the-man.io.s3.amazonaws.com/the/whole/key');
    t.equal(result.Bucket, 'results.s3llout-to-the-man.io', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in cn-north-1', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3.cn-north-1.amazonaws.com.cn/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in us-gov-east', (t) => {
    const result = s3Urls.fromUrl('https://s3-us-gov-east-1.amazonaws.com/test-bucket/the/whole/key');
    t.equal(result.Bucket, 'test-bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in us-gov-east', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3.us-gov-east-1.amazonaws.com/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost style in ap-southeast-1', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3.ap-southeast-1.amazonaws.com/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost dashed in cn-north-1', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3-cn-north-1.amazonaws.com.cn/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('fromUrl: BucketInHost dashed in ap-southeast-1', (t) => {
    const result = s3Urls.fromUrl('https://bucket.s3-ap-southeast-1.amazonaws.com/the/whole/key');
    t.equal(result.Bucket, 'bucket', 'expected bucket');
    t.equal(result.Key, 'the/whole/key', 'expected key');
    t.end();
});

test('valid', (t) => {
    t.notOk(s3Urls.valid('http://www.google.com'), 'not on s3');
    t.ok(s3Urls.valid('https://s3.amazonaws.com/bucket/the/whole/key'), 'bucket in path');
    t.ok(s3Urls.valid('https://bucket.s3.amazonaws.com/the/whole/key'), 'bucket in host');
    t.ok(s3Urls.valid('http://bucket.s3.amazonaws.com/the/whole/key'), 'http');
    t.ok(s3Urls.valid('s3://bucket/the/whole/key'), 's3');
    t.end();
});
