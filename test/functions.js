'use strict';
var chai = require('chai');
var assert = chai.assert;

var functions = require('../src/functions');

describe('function builder', function () {
    function testFunctionWithData(f, testCases) {
        testCases.forEach(function(data) {
            assert.closeTo(f(data[0]), data[1], 0.0001,
                         'f(' + data[0] + ') == ' + data[1]);
        });
    }

    it('should have an identity function', function() {
        var id = functions.id;
        assert.isFunction(id);
        var testCases = [
            [-2,-2],
            [0,0],
            [3,3]
        ];
        testFunctionWithData(id,testCases);
    });

    it('should create a constant function', function () {
        var f = functions.constant(5);
        assert.isFunction(f);
        var testCases = [
            [0,5],
            [14,5],
            [20,5],
            [-5,5]
        ];
        testFunctionWithData(f,testCases);
    });

    it('should restrict a function', function() {
        var f = function(x) { return 5*x; };
        //just to make sure that f!=0
        assert(f(3)!==0);

        var g = functions.restrict(f, 2,3);
        assert.isFunction(g);
        var testCases = [
            [-1,0],
            [1,0],
            [4,0],
            [10,0],
            [2,f(2)],
            [2.3,f(2.3)],
            [3,0]
        ];
        testFunctionWithData(g,testCases);
    });

    it('should restrict a function to the right', function() {
        var f = function(x) { return 5*x; };
        //just to make sure that f!=0
        assert(f(3)!==0);

        var g = functions.restrict(f, NaN,3);
        assert.isFunction(g);
        var testCases = [
            [-1,-5],
            [1,5],
            [4,0],
            [10,0],
            [2,f(2)],
            [2.3,f(2.3)],
            [3,0]
        ];
        testFunctionWithData(g,testCases);
    });

    it('should restrict a function to the left', function() {
        var f = function(x) { return 5*x; };
        //just to make sure that f!=0
        assert(f(3)!==0);

        var g = functions.restrict(f, 2, NaN);
        assert.isFunction(g);
        var testCases = [
            [-1,-0],
            [1,0],
            [4,20],
            [10,50],
            [2.3,f(2.3)],
            [2,f(2)],
            [3,f(3)]
        ];
        testFunctionWithData(g,testCases);
    });

    it('should build a linear function with slope 2', function() {
        var f = functions.linear().from(0,0).withSlope(2).build();
        assert.isFunction(f);
        var testCases = [
            [-3,-6],
            [-1,-2],
            [0,0],
            [1,2],
            [5,10]
        ];
        testFunctionWithData(f,testCases);
    });

    it('should build a linear function with starting point (-5,-2) and slope 2',function() {
        var f = functions.linear().from(-5,-2).withSlope(2).build();
        assert.isFunction(f);
        var testCases = [
            [-6,-4],
            [-5,-2],
            [0,8],
            [1,10],
            [5,18]
        ];
        testFunctionWithData(f,testCases);
    });

    it('should build a linear function with start and end point', function() {
        var f = functions.linear().from(-3,2).to(1,0).build();
        assert.isFunction(f);
        var testCases = [
            [-3,2],
            [1,0],
            [-1,1]
        ];
        testFunctionWithData(f, testCases);
    });

    it('should restrict a linear function', function() {
        var f = functions.linear().from(0,0).withSlope(1).build();
        var g = functions.restrict(f,1,2);
        assert.isFunction(g);
        var testCases = [
            [0,0],
            [0.5,0],
            [1,1],
            [1.5,1.5],
            [2,0],
            [3,0]
        ];
        testFunctionWithData(g, testCases);
    });

    it('should mount a simple function', function() {
        var f = function(x) { return 2*x; };
        var twice = functions.mount(f);
        var g = twice(functions.constant(2));
        assert.isFunction(g);
        assert.equal(4, g(10), 'twice constant 2 is 4');
    });

    it('should max two functions', function() {
        var f = functions.linear().from(-1,0).withSlope(2).build();
        var g = functions.constant(3);
        var h = functions.max(f,g);

        var testCases = [
            [-1,3],
            [0,3],
            [1,4],
            [2,6]
        ];
        testFunctionWithData(h, testCases);
    });

    it('should min two functions', function() {
        var f = functions.linear().from(-1,0).withSlope(2).build();
        var g = functions.constant(3);
        var h = functions.min(f,g);

        var testCases = [
            [-1,0],
            [0,2],
            [1,3],
            [2,3]
        ];
        testFunctionWithData(h, testCases);
    });

    it('should add two functions', function() {
        var f = functions.linear().from(-1,2).to(4,6).build();
        var g = functions.restrict(functions.constant(3), -2,2);
        var h = functions.sum(f,g);
        assert.isFunction(h);

        var testCases = [
            [-3,0.4],
            [-2,4.2],
            [-1,5],
            [0,5.8],
            [1,6.6],
            [2,4.4],
            [3,5.2]
        ];
        testFunctionWithData(h, testCases);
    });

    it('should negate a function', function() {
        var f = functions.linear().from(0,1).withSlope(2).build();
        var g = functions.neg(f);
        assert.isFunction(g);

        var testCases = [
            [-2,3],
            [-1,1],
            [0,-1],
            [1,-3],
            [2,-5]
        ];
        testFunctionWithData(g, testCases);
    });

    it('should create a piecewise linear function', function() {
        var f = functions.piecewise([-2,1],[0,0],[1,1]);
        assert.isFunction(f);

        var testCases = [
            [-3,1],
            [-2,1],
            [-1,0.5],
            [0,0],
            [0.5,0.5],
            [1,1],
            [2,1]
        ];
        testFunctionWithData(f, testCases);
    });
});
