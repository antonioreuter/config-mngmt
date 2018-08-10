'use strict';

const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const retrievePrefix = (params) => {
    const region = params.region || process.env.AWS_DEFAULT_REGION;
    const environment = params.env || process.env.CONFIG_ENV;
    const component = params.component;
    const fileName = params.fileName;
    const delimiter = params.delimiter || '/';
    
    var url = '';

    if (region) {
        url += region + delimiter;
        if (environment) {
            url += environment + delimiter;
            if (component) {
                url += component + delimiter;
                if (fileName) {
                    url += fileName;
                }
            }
        }
    }
    console.log(`URL: ${url}`);
    return { url, delimiter };
};

class ConfigFileRepository {
    listFiles(params) {
        const prefix = retrievePrefix(params);
        const bucket = params.bucket || process.env.BUCKET_NAME;

        var s3Params = {};
        s3Params.Bucket = bucket;
        s3Params.Delimiter = prefix.delimiter;
        s3Params.EncodingType = 'url';
        s3Params.Prefix = prefix.url;
        s3Params.MaxKeys = 10;

        return s3.listObjectsV2(s3Params).promise()
            .then(data => data.Contents.filter(obj => obj.Size > 0).map(obj => obj.Key))
            .catch(err => console.error(err));
    }

    upload(fileStream, params = {}) {
        const key = retrievePrefix(params).url;
        const bucket = params.bucket || process.env.BUCKET_NAME;

        const s3Params = {};

        s3Params.Bucket = bucket;
        s3Params.Key = key;
        s3Params.Body = fileStream;

        return s3.upload(s3Params).promise()
            .then((data) => {
                console.log(`Upload file result: ${JSON.stringify(data)}`);
            })
            .catch(err => console.error(err));
    }

    download(params) {
        const key = retrievePrefix(params).url;
        const bucket = params.bucket || process.env.BUCKET_NAME;
        const version = params.version || '';

        const s3Params = {};
        
        s3Params.Bucket = bucket;
        s3Params.Key = key;

        if (version) s3Params.VersionId = version;
        console.log(`Download... ${JSON.stringify(s3Params)}`);

        return s3.getObject(s3Params)
            .createReadStream()
            .pipe(fs.createWriteStream(params.targetName || params.fileName))
            .on('error', (err) => {
                throw new Error(`Error to download the object: ${err.message}`);
            });
    }
}

module.exports = ConfigFileRepository;
