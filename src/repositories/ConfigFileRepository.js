'use strict';

import 'aws-sdk'

const validateParams = (params) => {};

class ConfigFileRepository {
    constructor(config) {
        this.bucketName = config.bucketName;
        this.delimiter = config.delimiter || '/';
    }

    listFiles(params) {
        validateParams(params);
        
        const bucket = params.bucket;
        const region = params.region || process.env.AWS_DEFAULT_REGION;
        const environment = params.env || process.env.NODE_ENV;
        const component = params.component;
        
        var path = '';

        if (bucket) {
            path += bucket + this.delimiter;
            if (region) {
                path += region + this.delimiter;
                if (environment) {
                    path += environment + this.delimiter;
                    if (component) {
                        path += component + this.delimiter;
                    }
                }
            }
        }
        console.log(`Path: ${path}`);
        //TODO listar todos os arquivos de forma recurssiva
    }

    upload(filePath, fileName, params = {}) {
        // TODO upload a file to the bucket
        validateParams(params);
    }

    download(fileName, params = {}) {
        validateParams(params);
    }
}

module.exports = { ConfigFileRepository }
