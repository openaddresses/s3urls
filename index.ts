export interface S3Params {
    Bucket: string | undefined;
    Key: string | undefined;
}

export interface S3Permutations {
    S3: string;
    BucketInPath: string;
    BucketInHost: string;
}

export enum S3Style {
    S3 = 'S3',
    BucketInPath = 'BucketInPath',
    BucketInHost = 'BucketInHost',
}

const BucketInHostRegex = /\.s3([.-]|(\.dualstack\.))(\w{2}-(gov-)?\w{4,9}-\d\.)?amazonaws\.com(\.cn)?/

export default class S3URLs {
    static fromUrl(url: string): S3Params {
        const uri = new URL(url);
        uri.pathname = decodeURIComponent(uri.pathname || '');

        const style = (function(uri) {
            if (uri.protocol === 's3:') {
                return S3Style.S3;
            } else if (/^s3[.-](\w{2}-(gov-)?\w{4,9}-\d\.)?amazonaws\.com/.test(uri.hostname)) {
                return S3Style.BucketInPath;
            } else if (BucketInHostRegex.test(uri.hostname)) {
                return S3Style.BucketInHost;
            }
        })(uri);

        let bucket, key;
        if (style === S3Style.S3) {
            bucket = uri.hostname;
            key = uri.pathname.slice(1);
        } else if (style === S3Style.BucketInPath) {
            bucket = uri.pathname.split('/')[1];
            key = uri.pathname.split('/').slice(2).join('/');
        } else if (style === S3Style.BucketInHost) {
            const match = uri.hostname.replace(BucketInHostRegex, '');
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

    static toUrl(bucket: string, key: string): S3Permutations {
        return {
            'S3': ['s3:/', bucket, key].join('/'),
            'BucketInPath': ['https://s3.amazonaws.com', bucket, key].join('/'),
            'BucketInHost': ['https:/', bucket + '.s3.amazonaws.com', key].join('/')
        };
    }

    static valid(url: string): boolean {
        const params = this.fromUrl(url);
        return !!(params.Bucket && params.Key)
    }
}
