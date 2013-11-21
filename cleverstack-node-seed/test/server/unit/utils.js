var config = require('../../../config')
  , Injector = require('utils').injector
  , modelInjector = require('utils').modelInjector
  , Sequelize = require('sequelize')
  , Q = require('q')
  , mongoose = require( 'mongoose' )
  , connected = false;

exports.testEnv = function (fn) {
    var deferred = Q.defer();

    var db = new Sequelize(
        config.testDb.database, 
        config.testDb.username, 
        config.testDb.password,
        config.testDb.options
    );

    GLOBAL.injector = Injector(  __dirname + '/../../../src/services', __dirname + '/../../../src/controllers' );
    injector.instance( 'config', config );
    injector.instance( 'db', db );
    injector.instance( 'sequelize', db );
    injector.instance( 'mongoose', mongoose );

    // Get our models
    var models = require( 'models' )
    injector.instance( 'models', models );

    // Setup ODM
    if ( config.odm && config.odm.enabled && connected === false ) {
      connected = true;
      mongoose.connect(config.mongoose.uri);
    }

    models.ORM.TestModel = db.define('Test', {
        name: Sequelize.STRING,
    }, {
        paranoid: true
    });
    models.ORM.TestModel.ORM = true

    // Run our model injection service
    modelInjector( models );

    db
    .sync({force:true})
    .success(function () {
        injector.inject(fn);
    })
    .error(function (err) {
        throw err;
    });
};
