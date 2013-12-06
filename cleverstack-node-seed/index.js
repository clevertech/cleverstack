// Get everything ready
var config = require('./config')
    , express = require('express')
    , cors = require('cors')
    , webPort = process.env.NODE_WWW_PORT || config.webPort || 8080
    , env = process.env.NODE_ENV || config.environmentName || 'development'
    , initializeRoutes = require('./routes')
    , modelInjector = require('utils').modelInjector
    , Sequelize = require('sequelize')
    , Injector = require('utils').injector
    , passport = require('passport')
    , mongoose = require('mongoose')
    , initializeSecurity = require('./security')
    , app = express()
    , io = require('socket.io')
    , server = require('http').createServer(app)
    , io = io.listen(server);

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


/* Use Express only */
// app.listen(webPort, function() {
//     console.log("Starting server on port " + webPort + " in " + config.environmentName + " mode");
// });

/*
    Socket.io below uses same port as Express.
    Todo:
        - move this code into a controller/npm module
        - migrate to socket-io 1.0 when it is released
*/

// listen to port (default 8080 - same as express)
server.listen(webPort);
console.log('Express + Socket.io server is running and listening to port %d...', webPort);

// hash object to save clients data,
// { socketid: { clientid, nickname }, socketid: { ... } }
var chatClients = [];

// sets the log level of socket.io, with
// log level 2 we wont see all the heartbeats
// of each socket but only the handshakes and
// disconnections
io.set('log level', 3);

// setting the transports by order, if some client
// is not supporting 'websockets' then the server will
// revert to 'xhr-polling' (like Comet/Long polling).
// for more configurations got to:
// https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
io.set('transports', [ 'websocket', 'xhr-polling' ]);

/*
Setup transports for different environments:
https://github.com/LearnBoost/Socket.IO/wiki/Configuring-Socket.IO
*/
io.configure('production', function(){
    //The following options are recommended to be set in production:
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging

    // enable all transports (optional if you want flashsocket support, please note that some hosting
    // providers do not allow you to create servers that listen on a port different than 80 or their
    // default port)
    io.set('transports', [
        'websocket'
      , 'flashsocket'
      , 'htmlfile'
      , 'xhr-polling'
      , 'jsonp-polling'
    ]);
});

// socket.io events, each connection goes through here
// and each event is emited in the client.
io.sockets.on('connection', function(socket){

    // after connection, the client sends us the
    // client data through the connect event
    socket.on('connect', function(data){
        connect(socket, data);
    });

    // when a client sends a messgae, he emits
    // this event, then the server forwards the
    // message to other clients
    socket.on('chatmessage', function(data){
        chatmessage(socket, data);
        console.log(data);
    });

    // sends the user list to the user.
    socket.on('userlist', function(data){
        userlist(socket, data);
    });

    // when a client calls the 'socket.close()'
    // function or closes the browser, this event
    // is built in socket.io so we actually dont
    // need to fire it manually
    socket.on('disconnect', function(){
        disconnect(socket);
    });
});


// create a client for the socket
function connect(socket, data){
    // chatClients[socket.id] = data;
    data.socketid = socket.id;
    chatClients.push(data);
    // there is some bug here where this needs to be broadcasted also...
    // this works but needs to be investigated...
    // (same for disconnect below)
    socket.emit('userlist', chatClients);
    socket.broadcast.emit('userlist', chatClients);
    var msg = {
        id: new Date().getTime(),
        user: 'chatroom',
        type: 'room',
        text: 'User ' + data.username + ' has joined.'
    };
    socket.emit('chatmessage', msg);
    socket.broadcast.emit('chatmessage', msg);
}

// when a client disconnect
function disconnect(socket){
    var username = "";
    chatClients = chatClients.filter(function( obj ) {
        if (obj.socketid == socket.id) {
            username = obj.username;
        }
        return obj.socketid !== socket.id;
    });
    socket.emit('userlist', chatClients);
    socket.broadcast.emit('userlist', chatClients);
    var msg = {
        id: new Date().getTime(),
        user: 'chatroom',
        type: 'room',
        text: 'User ' + username + ' has left.'
    };
    socket.emit('chatmessage', msg);
    socket.broadcast.emit('chatmessage', msg);
}

// receive chat message from a client
function chatmessage(socket, data){
    // by using 'socket.broadcast' we can send/emit
    // a message/event to all other clients except
    // the sender himself
    socket.broadcast.emit('chatmessage', data);
}

// receive user list request from a client
function userlist(socket, data){
    socket.emit('userlist', chatClients);
    socket.broadcast.emit('userlist', chatClients);
}
