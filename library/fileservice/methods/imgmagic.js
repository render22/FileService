var im = require('imagemagick');
var fs = require('fs');
var q = require('q');
var fsException = require('../exceptions/fsexception.js');

module.exports = {

    resize: function (width, heigth, file, success, error) {
        if (!this.file && !file)
            throw new fsException('Source file not found', true);
        var self = this;
        resize(
            width,
            heigth,
            file ? file : this.file
        ).then(function (sourceFile) {
                self.fileContent = sourceFile;

                if (success instanceof Function) {
                    if (success(this) === undefined || success(this) === true)
                        self.resizeImageDefer.resolve();
                } else {
                    self.resizeImageDefer.resolve();
                }
            }, function (err) {
                self.cropImageDefer.reject();
                if (error instanceof Function)
                    error(err);
            });
    },

    crop: function (width, heigth, file, success, error) {
        if (!this.file && !file)
            throw new fsException('Source file not found', true);
        var self = this;
        crop(
            width,
            heigth,
            file ? file : this.file
        ).then(function (sourceFile) {
                self.fileContent = sourceFile;

                if (success instanceof Function) {
                    if (success(this) === undefined || success(this) === true)
                        self.cropImageDefer.resolve();
                } else {
                    self.cropImageDefer.resolve();
                }
            }, function (err) {
                self.cropImageDefer.reject();
                if (error instanceof Function)
                    error(err);
            });
    }


}

function crop(width, heigth, file) {
    var defer = q.defer();
    im.crop({
        srcPath: (file) ? file : this.file,
        width: width,
        height: heigth
    }, function (err, stdout, stderr) {
        if (err)
            defer.reject(err);
        else
            defer.resolve(stdout);
    });

    return defer.promise;
}


function resize(width, heigth, file) {
    var defer = q.defer();
    im.resize({
        srcPath: (file) ? file : this.file,
        width: width,
        height: heigth
    }, function (err, stdout, stderr) {
        if (err)
            defer.reject(err);
        else
            defer.resolve(stdout);
    });

    return defer.promise;
}
