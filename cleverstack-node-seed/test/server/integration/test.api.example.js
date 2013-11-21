var should = require('should'),
    request = require('supertest'),
    app = require('../../../index');

describe('/api/example', function () {
    describe('POST /api/example', function () {
        it('should return valid status', function (done) {
            request(app)
                .post('/api/example')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.eql({
                        status: 'Created record!'
                    });
                    done();
                });
        });
    });

    describe('GET /api/example', function () {
        it('should return valid status', function (done) {
            request(app)
                .get('/api/example')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.eql({
                        status: 'Sending you the list of examples.'
                    });
                    done();
                });
        });
    });

    describe('GET /api/example/:id', function () {
        it('should return valid status', function (done) {
            request(app)
                .get('/api/example/123')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.eql({
                        status: 'sending you record with id of 123'
                    });
                    done();
                });
        });
    });

    describe('PUT /api/example/:id', function () {
        it('should return valid status', function (done) {
            request(app)
                .put('/api/example/123')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.eql({
                        status: 'updated record with id 123'
                    });
                    done();
                });
        });
    });

    describe('DELETE /api/example/:id', function () {
        it('should return valid status', function (done) {
            request(app)
                .del('/api/example/123')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.body.should.eql({
                        status: 'deleted record with id 123'
                    });
                    done();
                });
        });
    });

    describe('GET /api/example/custom', function () {
        it('should return valid status', function (done) {
            request(app)
                .get('/api/example/custom')
                .expect('Content-Type', /html/)
                .expect(200)
                .end(function (err, res) {
                    if (err) return done(err);
                    res.text.should.equal('<p>Hello from custom action controller</p>');
                    done();
                });
        });
    });
});
