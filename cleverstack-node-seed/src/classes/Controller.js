var Controller = require('clever-controller');

module.exports = Controller.extend(
    /* @Static */
    {
        service: null
    },
    /* @Prototype */
    {
        listAction: function() {
            if ( this.Class.service !== null ) {
                var query = this.req.query;
                var options = {};
                if ( Object.keys( query ).length ) {
                    options.where = query;
                }
                this.Class.service.find( options )
                    .then( this.proxy( 'send' ) )
                    .fail( this.proxy( 'handleException' ) );
            } else {
                this.next();
            }
        },

        getAction: function() {
            if ( this.Class.service !== null ) {
                this.Class.service.findById( this.req.params.id )
                    .then( this.proxy( 'send' ) )
                    .fail( this.proxy( 'handleException' ) );
            } else {
                this.next();
            }
        },

        postAction: function() {
            if ( this.Class.service !== null ) {
                this.Class.service.create( this.req.body )
                    .then( this.proxy( 'send' ) )
                    .fail( this.proxy( 'handleException' ) );
            } else {
                this.next();
            }
        },

        putAction: function() {
            if ( this.Class.service !== null ) {
                this.Class.service.update( this.req.params.id, this.req.body )
                    .then( this.proxy( 'send' ) )
                    .fail( this.proxy( 'handleException' ) );
            } else {
                this.next();
            }
        },

        deleteAction: function() {
            if ( this.Class.service !== null ) {
                this.Class.service.destroy( this.req.params.id )
                    .then( this.proxy( 'send' ) )
                    .fail( this.proxy( 'handleException' ) );
            } else {
                this.next();
            }
        }
    });