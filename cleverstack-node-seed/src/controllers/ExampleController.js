module.exports = function() {
    return (require('classes').Controller).extend(
        /* @Prototype */
        {
            /**
             * This function only exists to show you calling the main controllers handleException() function,
             * you can use this as a hook to handle errors here in this controller before calling the main one
             */
            handleException: function( exception ) {
                this._super(exception);
            },

            /**
             * 'POST /example'
             */
            postAction: function() {
                this.send({
                    status: 'Created record!'
                });
            },

            /**
             * 'GET /example'
             */
            listAction: function() {
                this.send({
                    status: 'Sending you the list of examples.'
                });
            },

            /**
             * 'GET /example/12' or 'GET /example/get/12'
             */
            getAction: function() {
                this.send({
                    status: 'sending you record with id of ' + this.req.params.id
                });
            },

            /**
             * 'PUT /example/12'
             */
            putAction: function() {
                this.send({
                    status: 'updated record with id ' + this.req.params.id
                });
            },

            /**
             * 'DELETE /example/12' or 'GET /example/delete/12'
             */
            deleteAction: function() {
                this.send({
                    status: 'deleted record with id ' + this.req.params.id
                });
            },

            /**
             * 'GET/PUT/POST/DELETE /example/custom'
             */
            customAction: function() {
                this.render('example/custom.ejs', { message: 'Hello from custom action controller' });
            },

            /**
             * This function can never be called because it does not have 'Action' on the end of it
             */
            hidden: function() {
                console.log('Hidden function called, this should be impossible');
                process.exit();
            }
        });
}
