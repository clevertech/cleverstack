// Get everything ready
var config = require('./config'),
    express = require('express'),
    cors = require('cors'),
    webPort = process.env.NODE_WWW_PORT || config.webPort || 8080,
    env = process.env.NODE_ENV || config.environmentName || 'development',
    initializeRoutes = require('./routes'),
    modelInjector = require('utils').modelInjector,
    Sequelize = require('sequelize'),
    Injector = require('utils').injector,
    passport = require('passport'),
    mongoose = require('mongoose'),
    initializeSecurity = require('./security'),
    app = express();

var RedisStore = require('connect-redis')(express);

// Setup ORM
var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);

// Setup ODM
if (config.odm && config.odm.enabled) {
    mongoose.connect(config.mongoose.uri);
}

// Bootstrap our DI
GLOBAL.injector = Injector(__dirname + '/src/services/', __dirname + '/src/controllers/');

app.set('port', webPort);
app.set('injector', injector);

injector.instance('sequelize', sequelize);
injector.instance('config', config);
injector.instance('mongoose', mongoose);
injector.instance('db', sequelize);

// Get our models
var models = require('models')
injector.instance('models', models);

// Run our model injection service
modelInjector(models);

app.configure(function() {

    // static file delivery
    app.use(express['static'](__dirname + '/public'));

    // app.use( cors() ); // automatically supports pre-flighting
    app.use(cors({
        origin: true,
        credentials: true,
        headers: ["x-requested-with", "content-type"],
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
        maxAge: 1000000000
    }));

    // middleware stack
    app.use(express.bodyParser());

    // session management
    app.use(express.cookieParser());
    app.use(express.session({
        secret: config.secretKey,
        cookie: {
            secure: false,
            maxAge: 86400000
        },
        store: new RedisStore({
            host: config.redis.host,
            port: config.redis.port,
            prefix: config.redis.prefix + process.env.NODE_ENV + "_",
            password: config.redis.key
        })
    }));

    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.methodOverride());

    app.use(passport.initialize());
    app.use(passport.session());

    // register middleware for security headers
    initializeSecurity(app, config);

    app.use(app.router);

    app.set('views', __dirname + '/src/views');
    app.set('view engine', 'ejs');
    app.set('view options', {
        layout: false
    });

    // error handler, outputs json since that's usually
    // what comes out of this thing
    app.use(function(err, req, res, next) {
        console.log('Express error catch', err);
        res.json(500, {
            error: err.toString()
        });
    });
});

// register application routes
initializeRoutes(app);

module.exports = app;


app.listen(webPort, function() {
    console.log("Starting server on port " + webPort + " in " + config.environmentName + " mode");
});
