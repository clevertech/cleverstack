function Authentication( message ) {
    this.message = message;
}

Authentication.prototype = new Error();

module.exports = Authentication;