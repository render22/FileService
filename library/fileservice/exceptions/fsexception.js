var util = require('util');

util.inherits(fsException, Error);


function fsException(message, isShutDown) {
    Error.call(this);
    this.message = message;
    this.stack = (new Error).stack;

    if (isShutDown && process.env.NODE_ENV !== 'production')
         printAndShutDown(this);

}

function printAndShutDown(e) {
    console.log(e.message);
    console.log(e.stack);
    process.exit(1);
}

module.exports = fsException;