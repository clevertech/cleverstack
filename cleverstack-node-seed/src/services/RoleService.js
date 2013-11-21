var BaseService = require('./BaseService')
  , Q = require('q')
  , RoleService = null;

module.exports = function( db, RoleModel, PermissionModel ) {
    if (RoleService && RoleService.instance) {
        return RoleService.instance;
    }

    RoleService = BaseService.extend({

        // It seems by using Sequalize Model, its difficult to get all result with just one query.
        // Also i am having the sense that we need to add an "AccountId" field in the PermissionsRoles table.
        listRolesWithPerm : function( accId ){
            var deferred = Q.defer(),
                service = this;

            var sql = 'select t1.id, t1.name, t1.description, t3.id as permid, t3.action '
                    + 'from Roles t1'
                    + ' left join PermissionsRoles t2 on t1.id = t2.RoleId'
                    + ' left join Permissions t3 on t2.PermissionId = t3.id'
                    + ' where t1.AccountId = ' + accId
                    + ' ;';

            this.query( sql )
            .success( function( roles ){
                if( !roles ) { return deferred.resolve( [] ) } ;
                deferred.resolve( service.groupRolePermissions( roles ) );
            })
            .error( deferred.reject );

            return deferred.promise;
        },

        createRoleWithPermissions : function( data, accId ){
            var deferred = Q.defer()
            ,   service = this;

            service
            .saveNewRole( data, accId )
            .then( function( role ){
                return service.saveRolePermissions( role, data['permissions'] );
            })
            .then( deferred.resolve )
            .fail( deferred.reject );

            return deferred.promise;
        },

        saveNewRole : function( data, accId ){
            var deferred = Q.defer();

            var roledata = {
                name: data['name'],
                description: (data['description']) ? data['description'] : null ,
                AccountId : accId
            };

            RoleModel
            .create( roledata )
            .success( deferred.resolve )
            .error( deferred.reject );

            return deferred.promise;
        },

        saveRolePermissions : function( role, permIds ){
            var deferred = Q.defer()
            ,   permissions = [];


            if( !permIds || !permIds.length ){

                deferred.resolve({ id : role.id, name: role.name, permissions : permissions });

            }else{
                permissions  = permIds.map(function( p ){ return PermissionModel.build({ id:p }) });

                role
                .setPermissions(permissions)
                .success( function( savedperms ){
                    deferred.resolve({
                        id : role.id,
                        name: role.name,
                        permissions : savedperms.map(function(x){ return x.id})
                    });

                }).error( deferred.reject );
            }

            return deferred.promise;
        },

        updateRoleWithPermissions : function( data, accId ){
            var deferred = Q.defer()
            ,   service = this;


            RoleModel.find( data.id )
            .success( function( role ){
                if( role[ 'AccountId' ] != accId ){
                    deferred.resolve({ statuscode:403, message:"unauthorized" });
                    return;
                }

                service
                .updateRole( role, data )
                .then( service.removePermissions.bind( service ) )
                .then( function( updatedrole ){
                    return service.saveRolePermissions( updatedrole, data['permissions'] );
                })
                .then( deferred.resolve )
                .fail( deferred.reject );
            })
            .error( deferred.reject );

            return deferred.promise;
        },

        updateRole : function( role, data ){
            var deferred = Q.defer();

            var roledata = {
                name: data['name'],
                description: (data['description']) ? data['description'] : null
            };

            role
            .updateAttributes( roledata )
            .success( deferred.resolve )
            .error( deferred.reject );

            return deferred.promise;
        },

        removePermissions : function( role ){
            var deferred = Q.defer();

            var sql = 'delete from PermissionsRoles where RoleId = '+role.id
                    + ' ;';

            this.query( sql )
            .success( function( result ){
                deferred.resolve( role );
            })
            .error( deferred.reject );

            /*
                I am having the following issue during updates, with the code below
                https://github.com/sequelize/sequelize/issues/739,

             */

            // role
            // .setPermissions([])
            // .success( function( perms ){
            //     deferred.resolve( role );
            // })
            // .error( deferred.reject );

            return deferred.promise;
        },

        groupRolePermissions : function( roles ){
            var arr = []
            ,   grp = {};

            while( i = roles.pop() ){
                if( !grp[ i.id ] ){
                    grp[ i.id ] = {
                        id              : i.id,
                        "name"          : i.name,
                        "description"   : i.description,
                        "permissions"   : []
                    }
                }

                if( i.permid && i.action ){
                    grp[ i.id ].permissions.push( { permId: i.permid, action: i.action } );
                }
            }

            Object.keys(grp).forEach(function(key){
                arr.push(grp[key]);
            });

            return arr;
        }

    });

    RoleService.instance = new RoleService(db);
    RoleService.Model = RoleModel;

    return RoleService.instance;
};