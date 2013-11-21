var BaseService = require('./BaseService')
    , Q = require('q');

module.exports = function(db, ODMMongoModel) {
    var MongoService = BaseService.extend({

    });

    MongoService.Model = ODMMongoModel;
    return new MongoService(db);
};
