// Get the application config
GLOBAL.config = require('./../config');
var Injector = require( './../src/utils' ).injector;

// Setup ORM
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);
GLOBAL.db = sequelize;

GLOBAL.injector = Injector(  __dirname + '/src/services', __dirname + '/src/controllers' );
injector.instance( 'sequelize', sequelize );
injector.instance( 'config', config );

// Get our models
var models = require('./../src/models');

// Launch our background process class
GLOBAL.backgroundTasksClass = require('./../src/classes/BackgroundTasks.js');
GLOBAL.backgroundTasks = new backgroundTasksClass(config, models);
