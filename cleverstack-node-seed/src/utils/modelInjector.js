'use strict';

var fs = require( 'fs' );

module.exports = function ( models ) {
	if ( Object.keys( models.ORM ).length ) {
		Object.keys( models.ORM ).forEach(function( modelName ) {
			injector.instance( modelName + 'Model', models.ORM[ modelName ] );
			injector.instance( modelName + 'Model', models.ORM[ modelName ] );
		});

		Object.keys( models.ORM ).forEach(function( modelName ) {
			injector.instance( modelName + 'Model', models.ORM[ modelName ] );
			injector.instance( 'ORM' + modelName + 'Model', models.ORM[ modelName ] );
		});
	}

	if ( Object.keys( models.ODM ).length ) {
		Object.keys( models.ODM ).forEach(function( modelName ) {
			injector.instance( 'ODM' + modelName + 'Model', models.ODM[ modelName ] );
		});
	}
};
