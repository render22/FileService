var crypto = require('crypto');

module.exports={
    getRandomHashName: function(extension,length){
        var hashName = crypto.createHash('md5').update(crypto.randomBytes(32)).digest('hex');
        if(length)
            hashName=hashName.slice(0,length);

        if(extension)
             hashName+='.'+extension;

        return hashName;
    }
}
