var im = require('imagemagick');
im.identify('Desert.jpg', function(err, metadata){
    if (err) throw err;
    console.log(metadata);
})


im.resize({
    srcPath: 'Desert.jpg',
    dstPath: 'Desert-small.jpg',
    width:   256
}, function(err, stdout, stderr){
    if (err) throw err;
    console.log('resized kittens.jpg to fit within 256x256px');
});