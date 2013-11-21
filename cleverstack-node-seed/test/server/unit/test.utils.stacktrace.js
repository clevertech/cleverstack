'use strict';

var stacktrace = require('utils').stacktrace;

describe('utils', function () {
    describe('.stacktrace()', function () {
        it('should return array', function () {
            var stack = stacktrace();
            stack.should.be.instanceOf(Array);
        });

        it('should return stack stace beginning at current function', function () {
            function helloMyFilez () {
                var stack = stacktrace();
                stack[0].should.include('helloMyFilez');
            }
            helloMyFilez();
        });

        it('should contain function names and filepaths', function () {
            function helloMyFilez1 () {
                helloMyFilez2();
            }

            function helloMyFilez2 () {
                var stack = stacktrace();
                stack[0].should.include('helloMyFilez2');
                stack[0].should.include('server/unit/test.utils.stacktrace.js');
                stack[1].should.include('helloMyFilez1');
                stack[1].should.include('server/unit/test.utils.stacktrace.js');
            }

            helloMyFilez1();
        });
    });
});
