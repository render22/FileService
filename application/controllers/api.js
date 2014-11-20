
var validationConfig = require('../config/validation.json');
var formidable = require('formidable');

//fileservice library
var fserv = require('../../library/fileservice');


module.exports = {
    /**
     * Initializing then router startup
     * @param app
     */
    init: function (app) {
        this.app = app;
        this.bookshelf = app.get('bookshelf');

        this.config = app.get('config');

    },

    index: function (req, res) {
         /*
         First install following modules
           --- npm install aws-sdk
           --- npm install imagemagick
         Then set following environment variables
          SET aws_access_key_id=<key>
          SET aws_secret_access_key=<secret key>
          */
        /*
         Несмотря на то что методы чейнятся в цепочку, внутри они резолвятся с помощью промисов, все выполняется асинхронно.
         Цепочку можно прервать внутри любого метода, прописав внутри success колбэка return false, например
         .resizeImage(150, 150, null, function () {
               return false;
         }, function (error) {
         console.log(error);
         })
       */

        //loading config settings
        fserv.setConfig({
            allowedMimes: ["image/jpeg"],
            maxFilesize: 2000000,
            fileUploadDir: __dirname + "/../../tmp/",
            amazon:{
                bucket:"parrot-cuba",
                urlExpireTime: 300 //in seconds
            }

        });

        var form = new formidable.IncomingForm();

        //using formidable module for parsing and receiving incoming data
        form.parse(req, function (err, fields, files) {

            //generating filename based on provided
            var newFileName=fserv.helpers.getRandomHashName('jpg', 5);
            fserv.validate(files.file.path, function () {

            }, function (error) {
                console.log(error);
            }).resizeImage(150, 150, null, function () {

            }, function (error) {
                console.log(error);
            }).saveLocal(newFileName, function () {

            }, function (error) {
                console.log(error);
            }).pushToS3(newFileName,function (fs,s3Url) {
                 console.log(s3Url);
            }, function (error) {
                console.log(error);
            });

        });

        res.send('ok');
    }


}
