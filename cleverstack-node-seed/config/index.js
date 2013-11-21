var files = [ __dirname + '/global.json', __dirname + '/security.json' ]
  , ormJson = __dirname + '/orm.json'
  , odmJson = __dirname + '/odm.json'
  , fs = require( 'fs' )
  , envConfigOverride = __dirname + '/' + (process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'local') + '.json';

// Load ORM.json if its available and configured
if ( fs.existsSync( ormJson ) ) {
  files.push( ormJson );
} else {
  console.info( 'ORM.json not found, no ORM loaded.' );
}

// Load ODM.json if its available and configured
if ( fs.existsSync( odmJson ) ) {
  files.push( odmJson );
} else {
  console.info( 'ODM.json not found, no ODM loaded.' );
}

if ( fs.existsSync( envConfigOverride ) ) {
	files.push( envConfigOverride );
} else {
	throw new Error( 'Error: No configuration for environment: ' + process.env.NODE_ENV );
}

var config = require( 'nconf' ).loadFilesSync( files );
module.exports = config;
