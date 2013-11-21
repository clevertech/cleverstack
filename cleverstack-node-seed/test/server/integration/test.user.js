var should = require('should'),
    request = require('supertest'),
    app = require('../../../index'),
    testEnv = require('./util').testEnv,
    crypto = require('crypto');


describe('/user', function () {
    var authUser
    ,   cookie
    ,   authUsername = "dimitrios@clevertech.biz"
    ,   authPass = '1q2w3e';

    before(function( done ){
        this.timeout(9000);
        testEnv().then(function(){
           //Get Auth User
            request(app)
              .post('/user/login')
              .send({ username: authUsername, password: authPass })
              .end(function(err,res){
                should.not.exist(err);
                res.should.have.status(200);
                cookie = res.headers['set-cookie'];
                authUser   = res.body;
                done();
              });
        })
        .fail( done );
    });

    /*** GET REQUEST ***/
    describe('GET /users', function(){

        it('should return status 401 when unauthorized request has been made', function( done ){
            request( app )
            .get( '/users' )
            .end( function ( err, res ) {
                should.not.exist( err );
                res.should.have.status( 401 );
                done();
            });
        })

        it('should return status 200', function( done ){

            request(app)
                .get('/users')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');

                    done();
                });

        });

        it('should return array of users with role and team attached to the object', function( done ){

            request(app)
                .get('/users')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    should.exist(res.body.length);
                    res.body[0].should.be.a('object').and.have.property('id');
                    res.body[0].should.have.property( 'AccountId' ).and.equal( authUser.AccountId );
                    res.body[0].should.have.property( 'role' );
                    res.body[0].should.have.property( 'team' );
                    done();
                });

        });
    });

    describe('GET /users/:id', function(){

        it('should return status 401 when unauthorized request has been made', function( done ){
            request( app )
            .get( '/users/'+authUser.id )
            .end( function ( err, res ) {
                should.not.exist( err );
                res.should.have.status( 401 );
                done();
            });
        })

        it('should return status 200', function( done ){

            request(app)
                .get('/users/'+authUser.id)
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');

                    done();
                });
        });

        it('should return user with account, model and role attached to the object ', function( done ){

            request(app)
                .get('/users/'+authUser.id)
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    should.not.exist( res.body.length );
                    res.body.should.be.a( 'object' ).and.have.property( 'id' );
                    res.body.id.should.equal( authUser.id );

                    res.body.should.have.property( 'account' );
                    res.body.should.have.property( 'role' );
                    res.body.should.have.property( 'team' );

                    done();
                });
        });

        it('should return invalid status ', function( done ){

            request(app)
                .get('/users/noneExistedId')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(500);
                    res.should.have.header('content-type','application/json');
                    res.body.should.be.a( 'object' ).and.eql( {} );

                    done();
                });
        });
    });

    describe('GET /user/current', function(){

        it('should return status 200', function( done ){

            request(app)
                .get('/user/current')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');

                    done();
                });

        });

        it('should return authorized user', function( done ){

            request(app)
                .get('/user/current')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    should.not.exist( res.body.length );
                    res.body.should.be.a( 'object' ).and.have.property( 'id' );
                    res.body.id.should.equal( authUser.id );

                    done();
                });

        });

        it('should return status 404 and empty body', function( done ){

            request(app)
                .get('/user/current')
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(404);
                    res.should.have.header('content-type','application/json');
                    res.body.should.be.a( 'object' ).and.eql( {} );

                    done();
                });

        });
    });

    describe('GET /user/logout', function(){

        it('should return status 200', function( done ){

            request(app)
                .get('/user/logout')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');

                    done();

                });
        });

        it('should return empty object in the response body', function( done ){

            request(app)
                .get('/user/logout')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    should.not.exist( res.body.length );
                    res.body.should.be.a( 'object' ).and.eql( {} );
                    done();

                });
        });

        it('should invalidate initial cookie', function( done ){

            request(app)
                .get('/user/logout')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    request(app)
                        .get('/user/logout')
                        .set('cookie', cookie)
                        .end(function (err, res) {
                            should.not.exist(err);

                            res.should.have.status(401);
                            res.body.should.be.a( 'object' ).and.eql( {} );

                            done();

                        });
                });
        });
    });

    /*** PUT REQUEST ***/
    //is the same as POST /users/:id

    /*** POST REQUEST ***/
    describe('POST /user/login', function(){

        it('should return status 200', function( done ){

            request(app)
                .post('/user/login')
                .send({ username: authUsername, password: authPass })
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');
                    done();

                });
        });

        it('should return status 403 and empty body', function( done ){

            request(app)
                .post('/user/login')
                .send({ username: "unexisted", password: "wrongpass" })
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(403);
                    res.body.should.be.a( 'object' );
                    res.body.should.not.have.property( 'id' );

                    done();

                });
        });

        it('should return authorized user', function( done ){

            request(app)
                .post('/user/login')
                .send({ username: authUsername, password: authPass })
                .end(function (err, res) {
                    should.not.exist(err);

                    res.body.should.be.a( 'object' );
                    res.body.should.have.property( 'id' );
                    res.body.id.should.equal( authUser.id );

                    //Initialize cookie again
                    cookie   = res.headers['set-cookie'];
                    authUser = res.body;


                    done();

                });
        });

        it('should return status 403 and message if "confirm" field validates into false', function( done ){

            // 6 , 7
            request(app)
            .get('/users/'+6)
            .set('cookie', cookie)
            .end(function (err, res) {
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');


                res.body.should.have.property( 'id' );
                res.body.active.should.be.true;
                res.body.confirmed.should.be.false;

                request(app)
                .post('/user/login')
                .send({ username: res.body.username, password: '1q2w3e' })
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(403);
                    res.should.have.header('content-type','application/json');
                    done();

                });
            });
        });

        it('should return status 403 and message if "active" field validates into false', function( done ){

            // 6 , 7
            request(app)
            .get('/users/'+7)
            .set('cookie', cookie)
            .end(function (err, res) {
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');


                res.body.should.have.property( 'id' );
                res.body.active.should.be.false;
                res.body.confirmed.should.be.true;

                request(app)
                .post('/user/login')
                .send({ username: res.body.email, password: '1q2w3e' })
                .end(function (err, res) {
                    should.not.exist(err);

                    res.should.have.status(403);
                    res.should.have.header('content-type','application/json');
                    done();

                });
            });
        });
    })

    describe('POST /users', function(){
       // this.timeout(3000);
        
        it('should return status 401 when unauthorized request has been made', function( done ){
            request( app )
            .get( '/users' )
            .end( function ( err, res ) {
                should.not.exist( err );
                res.should.have.status( 401 );
                done();
            });
        })

        it('should return status 400 and message into the response body if user with given email exists', function( done ){

            var newuser = {
                username    : 'newuser234',
                email       :  authUser.email,
                password    : '123',
                firstname   : 'newusername234',
                lastname    : 'newusername324',
            };

            request(app)
            .post('/users')
            .set('cookie', cookie)
            .send(newuser)
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(400);
                res.should.have.header('content-type','application/json');

                // res.body.should.be.a( 'string' ).and.include( 'invalid' );
                done();
            });

        });

        it('should return status 200 and user object in the response', function( done ){

            var newuser = {
                username    : 'newuser243@email.com',
                email       : 'newuser243@email.com',
                password    : '123',
                firstname   : 'newusername234',
                lastname    : 'newusername324',
            };

            request(app)
            .post('/users')
            .set('cookie', cookie)
            .send(newuser)
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'object' );
                res.body.should.have.property( 'id' );
                res.body.should.have.property( 'username' ).and.equal( newuser.username );
                res.body.should.have.property( 'firstname' ).and.equal( newuser.firstname );
                res.body.should.have.property( 'fullName' ).and.equal( newuser.firstname +' '+newuser.lastname );
                done();
            });

        });
    });

    describe('POST /user/recover', function(){
        it('should return status 200 along with a message', function( done ){

            request(app)
            .post('/user/recover')
            .set('cookie', cookie)
            .send({ email: authUser.email })
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'string' ).and.not.be.empty;
                done();
            });

        });

        it('should return status 400 along with a message when email is not provided', function( done ){

            request(app)
            .post('/user/recover')
            .set('cookie', cookie)
            .send({ })
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(400);
                res.should.have.header( 'content-type','application/json' );

                res.body.should.be.a( 'string' ).and.not.be.empty;
                done();
            });

        });

        it('should return status 403 along with an empty respone body', function( done ){

            request(app)
            .post('/user/recover')
            .set('cookie', cookie)
            .send({ email:"unexisted@mail.com" })
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(403);
                res.should.have.header( 'content-type','application/json' );

                res.body.should.be.a( 'object' ).and.eql( {} );
                done();
            });

        });
    });

    describe('POST /user/reset', function(){
        it('should return status 400 and a message if password being evaluated into false', function( done ){


            request(app)
            .post('/user/reset')
            .send({
                user    :"validId",
                password: false,
                token : "validtoken"
            })
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status(400);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'string' );
                done();
            });
        });


        it('should return status 403 and empty object in the response body', function( done ){


            request(app)
            .post('/user/reset')
            .send({
                userId    :"wrongId",
                password: "wrongPass",
                token   : "invalidtoken"
            })
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status( 403 );
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'object' ).and.eql( {} );
                done();
            });
        });

    });

    describe('POST /users/:id', function(){

        it('should return status 401 when unauthorized request has been made', function( done ){
            request( app )
            .get( '/users' )
            .end( function ( err, res ) {
                should.not.exist( err );
                res.should.have.status( 401 );
                done();
            });
        })

        it('should return status 400 and a message if email field is not in the request body', function( done ){

             request(app)
                .post('/users/'+2)
                .set('cookie', cookie)
                .send( { firstname : "updatedName" } )
                .end(function(err,res){
                    should.not.exist(err);


                    res.should.have.status(400);
                    res.should.have.header('content-type','application/json');
                    // res.body.should.be.a( 'string' ).and.include( 'missing' );
                    done();
                });
        });

        it('should return status 200 along with user data in the body', function( done ){

             request(app)
                .post('/users/'+2)
                .set('cookie', cookie)
                .send( { id: 2, firstname : "updatedName" } )
                .end(function(err,res){
                    should.not.exist(err);


                    res.should.have.status(200);
                    res.should.have.header('content-type','application/json');

                    res.body.should.be.a( 'object' ).and.have.property( 'id' ).and.equal( 2 );
                    res.body.firstname.should.equal( "updatedName" );
                    done();
                });
        });

        it('should return status 401 if request user with different AccountId', function( done ){

             request(app)
                .post('/users/'+4)
                .set('cookie', cookie)
                .send( { firstname : "updatedName" } )
                .end(function(err,res){
                    should.not.exist(err);


                    res.should.have.status(401);
                    res.should.have.header('content-type','application/json');
                    res.body.should.be.a( 'object' ).and.eql( {} );
                    done();
                });
        });

        it('should return status 500 if user with such id does not exist', function( done ){

            var dataToUpdate = { id:'someid',firstname: 'updatedname' } ;

            request(app)
            .post('/users/'+'invalidid')
            .set('cookie', cookie)
            .send( dataToUpdate )
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status(500);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a('object').and.eql( {} );
                done();
            });


        });
    });


    describe('POST /users/confirm', function(){
        it('should return status 400 and message if one of the fields being evaluated into false', function( done ){


            request(app)
            .post('/users/confirm')
            .send({
                userId    :"validId",
                password: false,
                token : "validtoken"
            })
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status(400);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'string' );
                done();
            });

        });


        it('should return status 403 and empty object in the response body', function( done ){


            request(app)
            .post('/user/reset')
            .set('cookie', cookie)
            .send({
                userId      : "wrongId",
                password    : "wrongPass",
                token       : "invalidtoken"
            })
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status( 403 );
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'object' ).and.eql( {} );
                done();
            });

        });

        it('should return status 403 and empty object in the response body if user has already confirm the account', function( done ){



            request(app)
            .get('/users/'+7)
            .set('cookie', cookie)
            .end(function (err, res) {
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');


                res.body.should.have.property( 'id' );
                res.body.confirmed.should.be.true;

                request(app)
                .post('/users/confirm')
                .send({
                    userId      : 7,
                    password    : "validpass",
                    token       : "validtoken"
                })
                .end(function(err,res){
                    should.not.exist(err);

                    res.should.have.status( 403 );
                    res.should.have.header('content-type','application/json');

                    res.body.should.be.a( 'object' ).and.eql( {} );
                    done();
                });
            });

        });

    });
    
    describe('POST /users/:id/resend', function(){

        it('should return status 401 when unauthorized request has been made', function( done ){
            request( app )
            .get( '/users' )
            .end( function ( err, res ) {
                should.not.exist( err );
                res.should.have.status( 401 );
                done();
            });
        });

        it('should return status 403 when user id does not exist', function( done ){
            request(app)
            .post('/users/'+'noneExistedId'+'/resend')
            .set('cookie', cookie)
            .end(function(err,res){
                should.not.exist(err);


                res.should.have.status(403);
                res.should.have.header('content-type','application/json');
                res.body.should.be.a( 'string' ).and.not.be.empty;
                done();
            });
        });

        it('should return status 403 when has already confirmed the account', function( done ){
            request(app)
            .post('/users/'+authUser.id+'/resend')
            .set('cookie', cookie)
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(403);
                res.should.have.header('content-type','application/json');
                res.body.should.be.a( 'string' ).and.not.be.empty;
                authUser.confirmed.should.be.true;

                done();
            });
        });

        it('should return status 200 and a message when user does have his account confirmed', function( done ){
            this.timeout(5000);
            request(app)
            .post('/users')
            .set('cookie', cookie)
            .send({
                username    : 'newuser24355@email.com',
                email       : 'newuser24355@email.com',
                password    : '123',
                firstname   : 'newusername2345',
                lastname    : 'newusername3245',
            })
            .end(function(err,res){
                should.not.exist(err);

                res.should.have.status(200);
                res.should.have.header('content-type','application/json');
                res.body.should.be.a( 'object' );

                request(app)
                .get('/users')
                .set('cookie', cookie)
                .end(function (err, res) {
                    should.not.exist(err);

                    should.exist(res.body.length);
                    var userId;
                    res.body.forEach(function( user ){
                        if( user.email == 'newuser24355@email.com' ){
                            userId = user.id;
                        }
                    });
                    
                    request(app)
                    .post('/users/'+userId+'/resend')
                    .set('cookie', cookie)
                    .end(function(err,res){
                        should.not.exist(err);

                        res.should.have.status(200);
                        res.should.have.header('content-type','application/json');
                        res.body.should.be.a( 'string' ).and.not.be.empty;
                        done();
                    });
                   
                });
            });  
        });
    }); 

    /***** DELETE REQUEST *****/
    describe('DELETE /users/:id', function(){
        it('should return status 500 if user with such id does not exist', function( done ){

            request(app)
            .del( '/users/'+'invalidId' )
            .set('cookie', cookie )
            .end(function( err, res ){
                should.not.exist(err);


                res.should.have.status(500);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a('object');
                done();
            });
        });

        it('should return status 200 and an empty object in the response body', function( done ){

            request(app)
            .del( '/users/'+3 )
            .set('cookie', cookie )
            .end(function( err, res ){
                should.not.exist(err);


                res.should.have.status(200);
                res.should.have.header('content-type','application/json');

                res.body.should.be.a( 'object' ).and.eql( {} );
                done();
            });
        })
    });

});




