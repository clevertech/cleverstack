var should = require('should'),
    request = require('supertest'),
    app = require('../../../index'),
    testEnv = require('./util').testEnv;


describe( '/job', function () {
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
    
    // /*** GET REQUEST ***/
    describe('GET /permissions', function(){

        it('should return status 200 and an list of system defined permissions', function( done ){

            request( app )
                .get( '/permissions' )
                .set( 'cookie', cookie )
                .end( function ( err, res ) {
                    
                    should.not.exist( err );

                    res.should.have.status( 200 );
                    res.should.have.header( 'content-type', 'application/json' );

                    should.exist( res.body.length );
                    res.body.length.should.be.above( 0 );

                    done();
                });
        });

    });

});




