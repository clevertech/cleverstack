
module.exports = function( PermissionService ) {

    return (require('classes').Controller).extend(
    {

        service:PermissionService
    },
	/* @Prototype */
    {

    });
}
