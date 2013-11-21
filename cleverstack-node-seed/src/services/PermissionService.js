var BaseService = require('./BaseService')
  , Q = require('q')
  , PermissionService = null;

module.exports = function( db, PermissionModel ) {
    if (PermissionService && PermissionService.instance) {
        return PermissionService.instance;
    }

    PermissionService = BaseService.extend({

    });

    PermissionService.instance = new PermissionService(db);
    PermissionService.Model = PermissionModel;

    return PermissionService.instance;
};