var should = require('should'),
    testEnv = require('./utils').testEnv,
    BaseService = require('services').BaseService;

describe('service.BaseService', function () {
    var service, Service, Model;

    beforeEach(function (done) {
        testEnv(function (models) {
            Service = BaseService.extend();
            Model = models.ORM.TestModel;
            Service.Model = Model;
            service = new Service();
            done();
        });
    });

    describe('.setup(dbAdapter)', function () {
        it('should set .db to dbAdapter', function () {
            var db = {};
            service.setup(db);
            service.db.should.equal(db);
        });
    });

    describe('.startTransaction()', function () {
        it('should call .db.startTransaction()', function () {
            var promise = {};
            var db = {
                startTransaction: function () {
                    return promise;
                }
            };
            service.setup(db);
            service.startTransaction().should.equal(promise);
        });
    });

    describe('.query(sql)', function () {
        it('should call .db.query() with valid arguments', function () {
            var promise = {};
            var db = {
                query: function (sql, bindings, options) {
                    sql.should.eql('test');
                    should.not.exist(bindings);
                    options.should.eql({
                        raw: true
                    });
                    return promise;
                }
            };
            service.setup(db);
            service.query('test').should.equal(promise);
        });
    });

    describe('.findById(id)', function () {
        it('should find Model instance by id', function (done) {
            var data = {
                name: 'Joe'
            };
            Model.create(data)
            .success(function (obj) {
                service.findById(obj.id)
                .then(function (obj) {
                    obj.name.should.equal(data.name);
                    done();
                })
                .fail(done);
            })
            .error(done);
        });
    });

    describe('.create(data)', function () {
        it('should create new Model instance with data', function (done) {
            var data = {
                name: 'Joe'
            };
            service.create(data).then(function (obj) {
                Model.find(obj.id)
                .success(function (obj) {
                    obj.name.should.equal(data.name);
                    done();
                })
                .error(done);
            }, done);
        });
    });

    describe('.findAll(options)', function () {
        it('should return all Model instances', function (done) {
            var data1 = {
                name: 'Joe'
            };
            var data2 = {
                name: 'Rachel'
            };

            service.create(data1)
            .then(function () {
                return service.create(data2);
            })
            .then(function () {
                return service.findAll().then(function (objs) {
                    objs.should.have.length(2);
                    done();
                });
            })
            .fail(done);
        });
    });

    describe('.find(options)', function () {
        it('should return Model instances filtered by query options', function (done) {
            var data1 = {
                name: 'Joe'
            };
            var data2 = {
                name: 'Rachel'
            };

            service.create(data1)
            .then(function () {
                return service.create(data2);
            })
            .then(function () {
                return service.find({
                    where: {name: data2.name}
                }).then(function (objs) {
                    objs.should.have.length(1);
                    objs[0].name.should.equal(data2.name);
                    done();
                });
            })
            .fail(done);
        });
    });

    describe('.update(id, data)', function () {
        it('should update Model instance by id with data', function (done) {
            var data = {
                name: 'Joe',
                bookingStyle: 'slots'
            };
            Model.create(data)
            .success(function (obj) {
                service.update(obj.id, {
                    name: 'Ross'
                })
                .then(function () {
                    Model.find(obj.id)
                    .success(function (obj) {
                        obj.name.should.equal('Ross');
                        done();
                    })
                    .error(done);
                })
                .fail(done);
            })
            .error(done);
        });
    });

    describe('.destroy(id)', function () {
        it('should mark Model instance as deleted by id', function (done) {
            var data = {
                name: 'Joe',
                bookingStyle: 'slots'
            };
            Model.create(data)
            .success(function (obj) {
                service.destroy(obj.id)
                .then(function () {
                    Model.find(obj.id)
                    .success(function (obj) {
                        should.exist(obj.deletedAt);
                        done();
                    })
                    .error(done);
                })
                .fail(done);
            })
            .error(done);
        });
    });
});
