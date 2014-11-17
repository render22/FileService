var im = require('imagemagick');
im.identify('Desert.jpg', function (err, metadata) {

})


var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');
http.createServer(function (req, response) {
    im.resize({
        srcPath: 'Desert.jpg',
        dstPath: 'Desert-small.jpg',
        width: 256
    }, function (err, stdout, stderr) {
        if (err) throw err;
        console.log('resized kittens.jpg to fit within 256x256px');

        var filePath = path.join(__dirname, 'Desert-small.jpg');
        var stat = fileSystem.statSync(filePath);

        response.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': stat.size
        });

        var readStream = fileSystem.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(response);
        fileSystem.unlink(filePath);
    });

}).listen(process.env.PORT || 3000);