var Class = require('uberclass')
  , async = require('async')
  , httpGet = require( 'http-get' );


var ExampleTaskClass = Class.extend(
{

}, 

{
    ExampleTaksModel: null,

    init: function( ExampleTaksModel ) {
        this.ExampleTaksModel = ExampleTaksModel;
    },

    // Do not remove or alter the name of the function as it's being used in the backgroundTaks
    // Use this function in order to call the function that starts the task
    startTask : function( callback ){
        this.startExampleTask( callback );
    },

    startExampleTask: function( callback ) {
        this.ExampleTaksModel
            .findAll()
            .success( this.proxy( 'continueWithNextStep', callback ) )
            .error( callback );
    },

    continueWithNextStep: function( callback, documents ) {
        // async.forEach(
        //     documents,
        //     this.proxy( 'someOtherFunction', callback ),
        //     callback
        // );
    }
    
});

module.exports = new ExampleTaskClass( modelExampleTask );
