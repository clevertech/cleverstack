
module.exports = function( RoleService ) {

    return (require('classes').Controller).extend(
    {

        service:RoleService
    },
    /* @Prototype */
    {

        listAction: function() {
            var accId = this.req.user.account.id;

            RoleService
            .listRolesWithPerm( accId )
            .then( this.proxy( 'handleServiceMessage' ) )
            .fail( this.proxy( 'handleException' ) );
        },

        postAction: function() {
            var accId = this.req.user.account.id,
                data  = this.req.body;

            if( data.id ){ return this.putAction() };

            RoleService
            .createRoleWithPermissions( data, accId )
            .then( this.proxy( 'handleServiceMessage' ) )
            .fail( this.proxy( 'handleException' ) );
        },

        putAction: function(){
            var accId  = this.req.user.account.id,
                data   = this.req.body,
                roleId = this.req.params.id;

            if( data.id != roleId ){ return this.send( "Unauthorized" , 403 ) };
            if( !data['permissions'] || !data['permissions'].length ){ return this.send('Permisisons are missing', 400 ) };

            RoleService
            .updateRoleWithPermissions( data, accId )
            .then( this.proxy( 'handleServiceMessage' ) )
            .fail( this.proxy( 'handleException' ) );

        },
        handleServiceMessage : function(obj){

            if( obj.statuscode ){
                this.send( obj.message, obj.statuscode );
                return;
            };

            this.send( obj, 200 );
        }

    });
}
