'use strict';

import ConfigFileRepository from '../repositories/ConfigFileRepository'

class ConfigFileService {
    constructor(params) {
        this.repo = new ConfigFileRepository();
    }   

    listFiles(filter){
        return this.repo.listFiles(filter);
    }

    upload(filePath, fileName, targetName, params = {}) {
        // Copy the original file and rename the copy as targetName, upload file, then remove targetName
        return this.repo.upload(filePath, targetName, params);
    }

    download(fileName, targetName, params = {}) {
        // Download the file rename to a new name, then, remove the original file
        return this.repo.download(fileName, params);
    }
}
