var should = require('should'),
    sinon = require('sinon'),
    testEnv = require('./utils').testEnv,
    BaseController = require('classes').Controller,
    BaseService = require('services').BaseService;

describe('classes.Controller', function () {
    var Service,
        service,
        Controller,
        ctrl,
        objs = [];

    beforeEach(function (done) {
        testEnv(function (models) {
            Service = BaseService.extend();
            Service.Model = models.ORM.TestModel;
            service = new Service();

            Controller = BaseController.extend();
            Controller.service = service;
            Controller.prototype.fakeAction = function () {};

            var req = {
                params: { action: 'fakeAction' },
                method: 'GET',
                query: {}
            };
            var res = {
                send: function () {},
            };
            var next = function () {};
            ctrl = new Controller(req, res, next);

            service.create({
                name: 'Joe'
            })
            .then(function (obj) {
                objs.push(obj); 
                return service.create({
                    name: 'Rachel'
                });
            })
            .then(function (obj) {
                objs.push(obj); 
                done();
            })
            .fail(done);
        });
    });

    describe('.listAction()', function () {
        it('should call .send() with all Model instances', function (done) {
            ctrl.send = function (result) {
                result.should.have.length(2);
                done();
            };
            ctrl.listAction();
        });
    });

    describe('.getAction()', function () {
        it('should call .send() with Model instance by id', function (done) {
            ctrl.send = function (result) {
                result.name.should.equal(objs[0].name);
                done();
            };
            ctrl.req.params = {
                id: objs[0].id
            };
            ctrl.getAction();
        });
    });

    describe('.postAction()', function () {
        it('should create new Model instance', function (done) {
            ctrl.send = function (result) {
                service.findAll().then(function (objs) {
                    objs.should.have.length(3);
                    done();
                }, done);
            };

            ctrl.req.body = {
                name: 'Ross'
            };
            ctrl.postAction();
        });

        it('should call .send() with new Model instance', function (done) {
            ctrl.send = function (result) {
                result.name.should.equal('Ross');
                result.id.should.be.ok;
                done();
            };
            ctrl.req.body = {
                name: 'Ross',
            };
            ctrl.postAction();
        });
    });

    describe('.putAction()', function () {
        it('should update Model instance by id', function (done) {
            ctrl.send = function (result) {
                service.findById(objs[0].id)
                .then(function (obj) {
                    obj.name.should.equal('Ross');
                    done();
                }, done);
            };

            ctrl.req.params = {
                id: objs[0].id
            };
            ctrl.req.body = {
                name: 'Ross'
            };
            ctrl.putAction();
        });

        it('should call .send() with updated Model instance', function (done) {
            ctrl.send = function (result) {
                result.name.should.equal('Ross');
                result.id.should.equal(objs[0].id);
                done();
            };
            ctrl.req.params = {
                id: objs[0].id
            };
            ctrl.req.body = {
                name: 'Ross',
            };
            ctrl.putAction();
        });
    });

    describe('.deleteAction()', function () {
        it('should delete Model instance by id', function (done) {
            ctrl.send = function (result) {
                service.findById(objs[0].id)
                .then(function (obj) {
                    should.exist(obj.deletedAt);
                    done();
                }, done);
            };

            ctrl.req.params = {
                id: objs[0].id
            };
            ctrl.deleteAction();
        });
    });
});
