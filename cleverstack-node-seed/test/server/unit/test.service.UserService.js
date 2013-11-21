var should = require('should')
  , testEnv = require('./utils').testEnv;

describe('service.UserService', function () {
    var UserService;

    beforeEach(function (done) {
        testEnv(function (_UserService_) {
            UserService = _UserService_;
            done();
        }, done);
    });

    // describe('.authenticate(credentials)', function () {
    //     it('should return User with specified credentials', function (done) {
    //         var data1 = {
    //             username: 'Joe',
    //             email: 'joe@example.com',
    //             password: '1234'
    //         };
    //         var data2 = {
    //             username: 'Rachel',
    //             email: 'rachel@example.com',
    //             password: '1234'
    //         };

    //         UserService.create(data1)
    //         .then(function () {
    //             return UserService.create(data2);
    //         })
    //         .then(function () {
    //             return UserService.authenticate({
    //                 email: 'rachel@example.com',
    //                 password: '1234'
    //             })
    //             .then(function (user) {
    //                 user.username.should.equal(data2.username);
    //                 done();
    //             });
    //         })
    //         .fail(done);
    //     });
    // });
});
