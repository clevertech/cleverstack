var crypto = require('crypto')
  , async = require('async')
  , inflect = require('i')()
  , modelInjector = require('utils').modelInjector
  , Injector = require( '../src/utils' ).injector
  , mongoose = require( 'mongoose' );

// Get the application config
var config = require('./../config');

// Setup ORM
var Sequelize = require('sequelize');
var sequelize = new Sequelize(
    config.db.database,
    config.db.username,
    config.db.password,
    config.db.options
);

GLOBAL.injector = Injector(  __dirname + '/src/services', __dirname + '/src/controllers' );
injector.instance( 'config', config );
injector.instance( 'db', sequelize );
injector.instance( 'sequelize', sequelize );
injector.instance( 'mongoose', mongoose );

// Get our models
var models = require( 'models' )
injector.instance( 'models', models );

// Setup ODM
if ( config.odm && config.odm.enabled ) {
  mongoose.connect(config.mongoose.uri);
}

// Run our model injection service
modelInjector( models );

var seedData = require('./../schema/seedData.json');

var assocMap = {};
Object.keys(seedData).forEach(function( modelName ) {
    assocMap[modelName] = [];
});

async.forEachSeries(
    Object.keys(seedData),
    function forEachModelType( modelName, cb ) {
        var ModelType = models.ORM[modelName]
            , Models = seedData[modelName];

        async.forEachSeries(
            Models,
            function forEachModel( data, modelCb ) {
                var assocs = data.associations;
                delete data.associations;

                ModelType.create(data).success(function( model ) {
                    data.associations = assocs;

                    console.log('Created ' + modelName);
                    assocMap[modelName].push(model);
                    if ( data.associations !== undefined ) {
                        var assocLength = Object.keys(data.associations).length,
                            called = 0;

                        Object.keys(data.associations).forEach(function( assocModelName ) {
                            var required = data.associations[assocModelName]
                                , associations = [];

                            assocMap[assocModelName].forEach(function( m ) {
                                var isMatched = null;

                                Object.keys(required).forEach(function( reqKey ) {
                                    if ( isMatched !== false ) {
                                        if ( m[reqKey] === required[reqKey] ) {
                                            isMatched = true;
                                        } else {
                                            isMatched = false;
                                        }
                                    }
                                });

                                if ( isMatched ) {
                                    associations.push(m);
                                }
                            });

                            if ( associations.length ) {
                                var funcName = 'set' + inflect.pluralize(assocModelName);

                                // Handle hasOne
                                if ( typeof model[funcName] !== 'function' ) {
                                    funcName = 'set' + assocModelName;
                                    associations = associations[0];
                                }

                                console.log('Calling ' + funcName);
                                model[funcName](associations).success(function() {
                                    called++;

                                    if ( called == assocLength )
                                        modelCb(null);
                                }).error(modelCb);
                            }
                        });
                    } else {
                        modelCb(null);
                    }
                }).error(modelCb);
            },
            function forEachModelComplete( err ) {
                cb(err);
            }
        );
    },
    function forEachModelTypeComplete( err ) {
        console.log(err ? 'Error: ' : 'Seed completed with no errors', err);
        if ( config.odm && config.odm.enabled ) {
          mongoose.disconnect();
        }
    }
);