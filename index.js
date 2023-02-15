import s3signed from '@mapbox/s3signed';

export default class S3URLs {
    static fromUrl(url) {
        const uri = new URL(url);
        uri.pathname = decodeURIComponent(uri.pathname || '');

        const style = (function(uri) {
            if (uri.protocol === 's3:') return 's3';
            if (/^s3[.-](\w{2}-\w{4,9}-\d\.)?amazonaws\.com/.test(uri.hostname)) return 'bucket-in-path';
            if (/\.s3[.-](\w{2}-\w{4,9}-\d\.)?amazonaws\.com/.test(uri.hostname)) return 'bucket-in-host';
        })(uri);

        let bucket, key;
        if (style === 's3') {
            bucket = uri.hostname;
            key = uri.pathname.slice(1);
        }
        if (style === 'bucket-in-path') {
            bucket = uri.pathname.split('/')[1];
            key = uri.pathname.split('/').slice(2).join('/');
        }
        if (style === 'bucket-in-host') {
            const match = uri.hostname.replace(/\.s3[.-](\w{2}-\w{4,9}-\d\.)?amazonaws\.com(\.cn)?/, '');
            if (match.length) {
                bucket = match;
            } else {
                bucket =  uri.hostname.split('.')[0];
            }
            key = uri.pathname.slice(1);
        }

        return {
            Bucket: bucket,
            Key: key
        };
    }

    static toUrl(bucket, key) {
        return {
            's3': ['s3:/', bucket, key].join('/'),
            'bucket-in-path': ['https://s3.amazonaws.com', bucket, key].join('/'),
            'bucket-in-host': ['https:/', bucket + '.s3.amazonaws.com', key].join('/')
        };
    }

    static convert(url, to) {
        const params = this.fromUrl(url);
        return decodeURIComponent(this.toUrl(params.Bucket, params.Key)[to]);
    }

    static signed = s3signed;

    static valid(url) {
        const params = this.fromUrl(url);
        return params.Bucket && params.Key;
    }
}
