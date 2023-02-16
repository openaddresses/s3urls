# s3Urls

From bucket/key to URL and the other way around

## Usage

In javascript:

```javascript
var s3urls = require('@mapbox/s3urls');
var assert = require('assert');

var url = s3urls.toUrl('my-bucket', 'some/key');
assert.deepEqual(url, {
  's3': 's3://my-bucket/some/key',
  'bucket-in-path': 'https://s3.amazonaws.com/my-bucket/some/key',
  'bucket-in-host': 'https://my-bucket.s3.amazonaws.com/some/key'
});

var url = 'https://s3.amazonaws.com/my-bucket/some/key';
if (s3urls.valid(url)) {
  var result = s3urls.fromUrl(url);
  assert.deepEqual(result, {
    Bucket: 'my-bucket',
    Key: 'some/key'
  });
}
```
