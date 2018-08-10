'use strict';

const ConfigFileService = require('./services/ConfigFileService');
const ConfigFileRepository = require('./repositories/ConfigFileRepository');

const service = new ConfigFileService(new ConfigFileRepository());

const params = {};
params.bucket = 'areuter-config';
params.region = 'eu-west-1';
params.env = 'dev';
params.component = 'IoTGtwy';

console.log('Listing files...');
service.listFiles(params).then((files) => {
    if (!files || files.length === 0) console.log('There is no files');
    else files.forEach(f => console.log(f));
});

console.log('Downloading files...');
const downloadParams = {};
downloadParams.bucket = 'areuter-config';
downloadParams.env = 'dev';
downloadParams.region = 'us-east-1';
downloadParams.component = 'IoTGtwy';
downloadParams.fileName = 'myConfigFile.json';
downloadParams.targetName = `myConfigFile2-${downloadParams.env}-${downloadParams.region || process.env.AWS_DEFAULT_REGION}.json`;

service.download(downloadParams);

console.log('Uploading files...');
const uploadParams = {};
uploadParams.bucket = 'areuter-config';
uploadParams.env = 'dev';
uploadParams.region = 'us-east-1';
uploadParams.component = 'IoTGtwy';
uploadParams.sourceFile = 'myConfigFile.json';
uploadParams.targetName = `config-${uploadParams.env}-${uploadParams.region || process.env.AWS_DEFAULT_REGION}.json`;

service.upload(uploadParams);
