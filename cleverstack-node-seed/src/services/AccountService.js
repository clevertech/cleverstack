var BaseService = require('./BaseService')
  , Q = require('q')
  , Sequelize = require('sequelize')
  , crypto    = require('crypto')
  , sendgrid = require( 'utils').sendgrid
  , ejsFileRender = require( 'utils').ejsfilerender
  , AccountService = null;

module.exports = function( db, AccountModel, UserModel, RoleModel, config ) {

    if (AccountService && AccountService.instance) {
        return AccountService.instance;
    }

    AccountService = BaseService.extend({

        //Improtant: I have to change it with a transaction
        //It seems that QueryChainer acts more like a batch saving rather than transaction
        processRegistration : function( data ){
            var self = this;
            var deferred = Q.defer();

            var account = AccountModel.build({
                name: data.company,
                subdomain: data.subdomain,
                emailFwd: config.sendgrid.account.registration.forward || data.forward,
                active: false,
                SubscriptionId: 1
            });

            if ( data.password ) {
                data.password = crypto.createHash('sha1').update(data.password).digest('hex');
            }

            var user  =  UserModel.build({
                title     : data.title || null,
                username  : ( data.username ) ? data.username : data.email,
                email     : data.email,
                firstname : data.firstname,
                lastname  : data.lastname,
                password  : data.password,
                phone     : data.phone || null,
                active    : true,
                confirmed : true,
                hasAdminRight : true,
                RoleId : 1
            });

            var chainer = new Sequelize.Utils.QueryChainer();

            chainer.add( account.save() );
            chainer.add( user.save() );
            chainer.run()
                .success(function () {
                    Q.all([self.assignAccount(user, account), self.generateDefaultRoles(account)])
                        .then(function(resolves){
                            RoleModel.find({where: {name: 'Owner', AccountId: account.id}})
                                .success(function(role){
                                    user.updateAttributes({RoleId: role.id})
                                        .success(function(){
                                            deferred.resolve(resolves[0]);
                                        })
                                        .error(deferred.reject);
                                })
                                .error(deferred.reject);
                        }).fail(deferred.reject);

                })
                .error(function (err) {
                  console.log('Error:  ',err);
                  deferred.reject( err );
                });

            return deferred.promise;
        },

        assignAccount : function( user, account ){
            var deferred = Q.defer();

            user.updateAttributes( {AccountId: account.id} )
                .success(function(){
                    UserModel
                        .find({ where: {id: user.id}, include: [ AccountModel ] })
                        .success(deferred.resolve)
                        .error(deferred.reject);

                })
                .error( deferred.reject );

            return deferred.promise;
        },

        /**
         * Change this thing anyway you like, but new account MUST have roles available upon creation
         * Generates default account roles
         * @param  {object} account newly creatd account instance
         * @return {object}         promise
         */
        generateDefaultRoles: function(account){
            var deferred = Q.defer();
            var defaultRoles = [
                'Owner',
                'Super Admin',
                'HR Manager',
                'HR Assistant',
                'Business Unit Manager',
                'Recruiter',
                'General User'
            ];

            var roles = defaultRoles.map(function(role){
                return {
                    name: role,
                    AccountId: account.id
                };
            });

            RoleModel.bulkCreate(roles)
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;
        },

        generateRegistrationHash : function( ua , secretKey ){

            var deferred = Q.defer();
            var hash, md5;
            var createdAt = (ua.account) ? ua.account.createdAt : ua.createdAt,
                updatedAt = (ua.account) ? ua.account.updatedAt : ua.updatedAt,
                subdomain = (ua.account) ? ua.account.subdomain : ua.subdomain;

            console.log('Generating hash with secretKey:', secretKey, 'createdAt: ', createdAt, 'updatedAt:', updatedAt, 'subdomain:', subdomain, 'account_verify');
            md5 = crypto.createHash( 'md5' );
            md5.update( secretKey + createdAt+ updatedAt+ subdomain+ 'account_verify', 'utf8' );
            hash = md5.digest( 'hex' );

            deferred.resolve(hash);
            return deferred.promise;
        },


        mailRegistrationCode : function( ua, token ){
            var mailer = sendgrid( config.sendgrid )
             ,  bakeTemplate = ejsFileRender( config.mailTemplatePaths );


            var  to      = ua.email
                ,from    = config.sendgrid.defaults.noReply || config.sendgrid.defaults.from
                ,subject = config.sendgrid.accountActivation.subject
                ,link    = config.hosturl + '/registration_confirm/' + ua.AccountId + '/' + token
                ,text    = 'Please click on the link below to activate your account\n  '+link
                ,info    = {'link': link};


            return bakeTemplate( 'accountActivation', info )
                    .then( function( html ){
                        return mailer( to, from, subject, text, html );

                    })
                    .then(function(){
                        return 'Account created succefully';
                    });
        },

        //Public Function
        getAccountById : function( accId ){
            var deferred = Q.defer();

            AccountModel
            .find({ where:{ id: accId, active: true }, attributes:['id', 'info', 'name','subdomain','logo','themeColor','emailFwd'] })
            .success( function( account ){
                if(!account){
                    return deferred.resolve({});
                }

                deferred.resolve( account );
            })
            .error( deferred.resolve );

            return deferred.promise;
        }

    });

    AccountService.instance = new AccountService(db);
    AccountService.Model = AccountModel;

    return AccountService.instance;
};
