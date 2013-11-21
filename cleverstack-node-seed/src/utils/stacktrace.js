'use strict';

module.exports = function () {
    return new Error().stack.split('\n').splice(2);
};
