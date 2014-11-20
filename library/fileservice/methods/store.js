var fs = require('fs');
var q = require('q');
var fsException = require('../exceptions/fsexception.js');
var AWS = require('aws-sdk');

module.exports = {
    local: function (fileName, success, error) {

        if (!this.config)
            throw new fsException('Config not found', true);

        if (!this.file)
            throw new fsException('Source file not found', true);

        if (!fileName)
            throw new fsException('file name must be set', true);

        if (!this.config.fileUploadDir)
            throw new fsException('File upload dir must be set', true);

        var uploadDir = this.config.fileUploadDir.replace(/\/$/, '');

        if (!fs.existsSync(uploadDir))
            throw new fsException(uploadDir + ' does not exist', true);

        var self = this;
        if (this.fileContent) {
            fs.writeFile(uploadDir + '/' + fileName, this.fileContent, 'binary', function (err) {
                if (err) {
                    self.saveLocalDefer.rejected();
                    if (error instanceof Function)
                        error(err);
                } else {
                    if (success instanceof Function) {
                        if (success(this) === undefined || success(this) === true)
                            self.saveLocalDefer.resolve();
                    } else {
                        self.saveLocalDefer.resolve();
                    }

                }

            });

            this.fileContent = null;
        } else {
            fs.rename(this.file, uploadDir + '/' + fileName, function (err) {
                if (err) {
                    self.saveLocalDefer.rejected();
                    if (error instanceof Function)
                        error(err);
                } else {
                    if (success instanceof Function) {
                        if (success(this) === undefined || success(this) === true)
                            self.saveLocalDefer.resolve();
                    } else {
                        self.saveLocalDefer.resolve();
                    }

                }

            });
        }


    },

    s3: function (fileName, success, error) {
        var self = this;
        if (!this.config)
            throw new fsException('Config not found', true);

        if (!fileName)
            throw new fsException('file name must be set', true);

        if (!this.config.fileUploadDir)
            throw new fsException('File upload dir must be set', true);

        var sourceFile = this.config.fileUploadDir.replace(/\/$/, '') + '/' + fileName;

        if (!fs.existsSync(sourceFile))
            throw new fsException(sourceFile + ' does not exist', true);

        fs.readFile(sourceFile, function (err, buf) {
            if (err) {
                if (error instanceof Function)
                    error(err);
            } else {

                var s3bucket = new AWS.S3({params: {Bucket: self.config.amazon.bucket}});
                var data = {Key: fileName, Body: buf};
                s3bucket.putObject(data, function (err, data) {
                    if (err) {
                        self.pushToS3Defer.reject();
                        if (error instanceof Function)
                            error("S3 error uploading data: " + err);

                    } else {
                        var url = s3bucket.getSignedUrl('getObject', {
                            Key: fileName,
                            Expires: self.config.amazon.urlExpireTime
                        });
                        if (success instanceof Function) {
                            if (success(this,url) === undefined || success(this,url) === true)
                                self.pushToS3Defer.resolve();
                        } else {
                            self.pushToS3Defer.resolve();
                        }

                    }

                })

            }


        });

    }
}
