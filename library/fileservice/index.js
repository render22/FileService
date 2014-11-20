var validation = require('./methods/validation.js');
var storage = require('./methods/store.js');
var imgmagic = require('./methods/imgmagic.js');
var q = require('q');

module.exports = {
    promises: [],
    prevPromise: function () {
        if (this.promises.length < 2)
            return null;
        else if (this.promises.length >= 2)
            return this.promises[this.promises.length - 2];

    },

    lastPromise: function () {
        return this.promises[this.promises.length - 1];
    },

    setConfig: function (config) {
        this.config = config;
    },
    validate: function (file, success, error, noPromise) {
        if (!noPromise) {
            this.validateDefer = q.defer();
            this.promises.push(this.validateDefer.promise);
        }
        validation.apply(this, arguments);


        return this;
    },


    saveLocal: function (filename, success, error, noPromise) {
        var self = this;
        var args = arguments;
        if (!noPromise) {
            this.saveLocalDefer = q.defer();
            this.promises.push(this.saveLocalDefer.promise);
        }

        if (this.prevPromise()) {
            this.prevPromise().then(function () {
                storage.local.apply(self, args);
            });
        } else {
            storage.local.apply(this, arguments);

        }

        return this;

    },

    pushToS3: function(filename, success, error, noPromise){
        var self = this;
        var args = arguments;
        if (!noPromise) {
            this.pushToS3Defer = q.defer();
            this.promises.push(this.pushToS3Defer.promise);
        }

        if (this.prevPromise()) {
            this.prevPromise().then(function () {
                storage.s3.apply(self, args);
            });
        } else {
            storage.s3.apply(this, arguments);

        }

        return this;
    },

    resizeImage: function (width, height, file, success, error, noPromise) {
        var self = this;
        var args = arguments;
        if (!noPromise) {
            this.resizeImageDefer = q.defer();
            this.promises.push(this.resizeImageDefer.promise);
        }

        if (this.prevPromise()) {
            this.prevPromise().then(function () {
                imgmagic.resize.apply(self, args);
            });
        } else {
            imgmagic.resize.apply(this, arguments);

        }

        return this;
    },

    cropImage: function (width, height, file, success, error, noPromise) {
        var self = this;
        var args = arguments;
        if (!noPromise) {
            this.cropImageDefer = q.defer();
            this.promises.push(this.cropImageDefer.promise);
        }

        if (this.prevPromise()) {
            this.prevPromise().then(function () {
                imgmagic.crop.apply(self, args);
            });
        } else {
            imgmagic.crop.apply(this, arguments);

        }

        return this;
    },

    helpers: require('./helpers/util.js'),


    setSourceFile: function (file) {
        this.file = file;
    }

}
