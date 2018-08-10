'use strict';

const fs = require('fs');
const path = require('path');
const IllegalArgumentError = require('../errors/InvalidArgumentError');

const validateDefaultParams = (params) => { 
    if (params == undefined) throw new IllegalArgumentError('There are no arguments.');
    if (params.bucket == undefined) throw new IllegalArgumentError('The bucket name must be specified.');
    if (params.region == undefined && process.env.AWS_DEFAULT_REGION == undefined) throw new IllegalArgumentError('A region must be specified or the environment variable AWS_DEFAULT_REGION needs to be configured.');
    if (params.env == undefined && process.env.CONFIG_ENV == undefined) throw new IllegalArgumentError('An environment must be specified or the environment variable CONFIG_ENV needs to be configured.');
    if (params.component == undefined) throw new IllegalArgumentError('The component name must be specified.')

    return true;
};

class ConfigFileService {
    constructor(configFileRepository) {
        this.configFileRepository = configFileRepository;
    }   

    listFiles(params){
        validateDefaultParams(params);

        return this.configFileRepository.listFiles(params);
    }

    upload(params = {}) {
        // Copy the original file and rename the copy as targetName, upload file, then remove targetName
        validateDefaultParams(params);
        if (params.sourceFile == undefined) throw new IllegalArgumentError('The source file path must be specified.');
        
        params.fileName = params.fileName || path.basename(params.sourceFile);

        try {
            const uploadStream = fs.createReadStream(params.sourceFile);
            return this.configFileRepository.upload(uploadStream, params);
        } catch(err) {
            console.log('Error to read file. File does not exist.');
            console.error(err);
            throw err;
        }
    }

    download(params = {}) {
        validateDefaultParams(params);
        if (params.fileName == undefined) throw new IllegalArgumentError('The file name for download must be specified.');

        this.configFileRepository.download(params);     
    }
}

module.exports = ConfigFileService;
