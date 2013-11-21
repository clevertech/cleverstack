var helmet = require('helmet');

module.exports = function( app, config ) {

    // Content Security Policy
    if ( config.security.csp ) {
        app.use(helmet.csp());
        if ( config.security.csp.policy ) {
            helmet.csp.policy(config.security.csp.policy);
        }
    }

    // HTTP Strict Transport Security
    if ( config.security.hsts ) {
        app.use(helmet.hsts(config.security.hsts.maxAge, config.security.hsts.includeSubdomains));
    }

    // X-FRAME-OPTIONS
    if ( config.security.xframe ) {
        if (config.security.xframe.mode === 'allow-from') {
            app.use(helmet.xframe('allow-from', config.security.xframe.from));
        } else {
            app.use(helmet.xframe(config.security.xframe.mode));
        }
    }

    // X-XSS-PROTECTION for IE8+
    if ( config.security.iexss) {
        app.use(helmet.iexss());
    }

    // X-Content-Type-Options nosniff
    if ( config.security.contentTypeOptions ) {
        app.use(helmet.contentTypeOptions());
    }

    // Cache-Control no-store, no-cache
    if ( config.security.cacheControl ) {
        app.use(helmet.cacheControl());
    }

};
