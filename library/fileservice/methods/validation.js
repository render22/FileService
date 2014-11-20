var fs = require('fs');
var q = require('q');

var spawn = require('child_process').spawn;
var fsException = require('../exceptions/fsexception.js');

module.exports = function (file, success, error) {
    if (!this.config)
        throw new fsException('Config not found', true);
    var config = this.config;
    var self = this;

    isFileExists(file, config).then(validateSize).then(validateMime).then(function (file) {
        self.file = file;
        if (success instanceof Function) {
            if (success(this) === undefined || success(this) === true)
                self.validateDefer.resolve();
        } else {
            self.validateDefer.resolve();
        }


    }, function (err) {
        self.cropImageDefer.rejected();
        if (error instanceof Function)
            error(err);
    });


}

function validateMime(data) {
    var defer = q.defer();

    var file = spawn('file', ["--mime-type", "-b", data.file]);
    var errInfo = '';
    file.stderr.on('data', function (buffer) {
        errInfo += buffer.toString();
    });

    file.stderr.on('end', function () {
        defer.reject(errInfo);

    });

    file.stdout.on('data', function (buffer) {

        var mime = buffer.toString().trim();
        if (data.config && data.config.allowedMimes && !~data.config.allowedMimes.indexOf(mime)) {
            defer.reject(mime + ' is out of list allowed mime-types');
        } else {
            defer.resolve(data.file);
        }

    });

    file.on('exit', function (code) {

        defer.resolve();
    });


    return defer.promise;
}


function validateSize(data) {
    var defer = q.defer();

    fs.stat(data.file, function (err, stats) {

        if (err)
            defer.reject(err.message);

        if (data.config && data.config.maxFilesize && stats.size > data.config.maxFilesize)
            defer.reject('size of ' + data.file + ' greater than allowed ' + data.config.maxFilesize);
        else
            defer.resolve(data);


    });
    return defer.promise;


}

function isFileExists(file, config) {
    var defer = q.defer();

    fs.exists(file, function (exists) {
        if (!exists)
            defer.reject('file ' + file + ' does not exist');
        else
            defer.resolve({
                file: file,
                config: config
            });

    });
    return defer.promise;
}




