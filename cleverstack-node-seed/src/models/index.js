var fs = require( 'fs' )
  , path = require( 'path' )
  , debug = require( 'debug' )( 'modelLoader' )
  , m = module.exports = { ORM: {}, ODM: {} }
  , sequelize = injector.getInstance( 'sequelize' )
  , config = injector.getInstance( 'config' )
  , mongoose = injector.getInstance( 'mongoose' );

debug( 'Loading models...' );

// load ORM models if its configured
if ( config.orm && config.orm.enabled ) {
    config.orm.models.forEach( function( modelName, i ) {
        var modelPath = [ __dirname, 'orm', modelName + '.js' ].join( path.sep );
        if ( fs.existsSync( modelPath ) ) {
            debug( 'Loading ORM Model %s', modelName );

            m[ 'ORM' ][ modelName ] = sequelize.import( modelPath );
            m[ 'ORM' ][ modelName ].ORM = true;
        }
    });

    // Define relationships
    Object.keys(config.orm.modelAssociations).forEach( function( modelName, i ) {
        var keys = Object.keys( config.orm.modelAssociations[ modelName ] )
          , len = keys.length
          , i = 0;

        Object.keys( config.orm.modelAssociations[ modelName ] ).forEach( function( assocType ) {
            var associatedWith = config.orm.modelAssociations[ modelName ][ assocType ];
            if ( ! associatedWith instanceof Array ) {
                associatedWith = [ associatedWith ];
            }

            associatedWith.forEach( function( assocTo ) {
                debug( '%s %s of %s', modelName, assocType, assocTo );
                // Support second argument
                if ( assocTo instanceof Array ) {
                    debug( '%s %s %s with second argument of %s', modelName, assocType, assocTo[0], assocTo[1] );
                    m['ORM'][ modelName ][ assocType ]( m[ assocTo[0] ], assocTo[1] );
                } else {
                    debug( '%s %s %s', modelName, assocType, assocTo );
                    m['ORM'][ modelName ][ assocType ]( m['ORM'][assocTo] );
                }
            });
        });
    });
}

// load ODM models if its configured
if ( config.odm && config.odm.enabled ) {
    config.odm.models.forEach( function( modelName, i ) {
        var modelPath = [ __dirname, 'odm', modelName + '.js' ].join( path.sep );
        if ( fs.existsSync( modelPath ) ) {
            debug( 'Loading ODM Model %s', modelName );

            m[ 'ODM' ][ modelName ] = require( modelPath )( mongoose );
            m[ 'ODM' ][ modelName ].ODM = true;
        }
    });
}

debug( 'Finished loading models.' );