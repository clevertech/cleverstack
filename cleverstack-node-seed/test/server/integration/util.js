var config = require('../../../config')
  , Injector = require('utils').injector
  , modelInjector = require('utils').modelInjector
  , Sequelize = require('sequelize')
  , Q = require('q')
  , mongoose = require( 'mongoose' )
  , connected = false;

var exec = require('child_process').exec
  , path = require('path');

exports.testEnv = function () {
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

    // Run our model injection service
    modelInjector( models );

    db
    .sync({force:true})
    .success(function () {
        //Seed DataBase
        var seedCmd   = 'export NODE_ENV=local;export NODE_TEST=test;node ' +
                        path.resolve(__dirname + '/../../../bin/seedModels.js');

        exec(seedCmd,function(){
            console.log("********************* DB HAS BEEN REBASED AND SEEDED *********************");
            deferred.resolve();
        });

    })
    .error(deferred.reject);

    return deferred.promise;
};
