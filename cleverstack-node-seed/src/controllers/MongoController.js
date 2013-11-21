module.exports = function(MongoService) {

    return (require('classes').Controller).extend(
        {
            service: MongoService,
        },
        {
            createAction: function() {
                var self = this
                  , data = self.req.body;

                MongoService
                    .create(data)
                    .then(this.proxy('send'))
                    .fail(self.proxy('handleException'));
            },


            listAction: function() {
                var self = this;

                MongoService
                    .find()
                    .then(this.proxy('send'))
                    .fail(self.proxy('handleException'));
            },

            updateAction: function(){
                var self = this
                  , id = this.req.params.id
                  , data = self.req.body;

                MongoService
                    .update(id, data)
                    .then(this.proxy('send'))
                    .fail(self.proxy('handleException'));
            },

            destroyAction: function(){
                var self = this
                  , id = this.req.params.id;

                MongoService
                    .destroy(id)
                    .then(this.proxy('send'))
                    .fail(self.proxy('handleException'));
            }

        }
    );
};
