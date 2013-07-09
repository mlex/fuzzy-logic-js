'use strict';

var functions;
exports = module.exports = functions = {
    id: function(x) {
        return x;
    },

    constant: function(x) {
        return function() {
            return x;
        };
    },

    restrict: function(f, startx, endx) {
        return function(x) {
            if (x<startx) { return 0; }
            if (x>=endx) { return 0; }
            return f(x);
        };
    },

    linear: function() {
        function LinearFunctionBuilder() {
        }
        LinearFunctionBuilder.prototype.from = function(x,y) {
            this.from = {x:x,y:y};
            return this;
        };
        LinearFunctionBuilder.prototype.to = function(x,y) {
            this.to = {x:x,y:y};
            return this;
        };
        LinearFunctionBuilder.prototype.withSlope = function(slope) {
            this.slope = slope;
            return this;
        };
        LinearFunctionBuilder.prototype.build = function() {
            if (! this.from) {
                throw new Error('Unable to build linear function without starting point.');
            }
            if (!(this.to || this.slope)) {
                throw new Error('Unable to build linear function without either end point or slope.');
            }
            if (! this.slope) {
                this.slope = (this.from.y - this.to.y)/(this.from.x-this.to.x);
            }
            var that = this;
            return function(x) {
                return that.from.y + that.slope * (x-that.from.x);
            };
        };
        return new LinearFunctionBuilder();
    },

    mount: function(operator) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return function(x) {
                return operator.apply(
                    {},
                    args.map(
                        function(f) { return f(x); }
                    )
                );
            };
        };
    },

    neg: function(f) {
        return function(x) {
            return -f(x);
        };
    }
};

functions.max = functions.mount(Math.max);

functions.min = functions.mount(Math.min);

functions.sum = functions.mount(
    function() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function(x,y) { return x+y; });
    }
);

functions.piecewise = function() {
    var args = Array.prototype.slice.call(arguments);
    var vertices = args.sort(function (a,b) {
        return a[0]>b[0];
    });
    var verticeCount = vertices.length;
    var result = functions.restrict(
        functions.constant(vertices[0][1]),
        NaN,
        vertices[0][0]);
    var i;
    for (i=1; i<verticeCount; ++i) {
        result = functions.sum(
            result,
            functions.restrict(
                functions.linear()
                    .from(vertices[i-1][0],vertices[i-1][1])
                    .to(vertices[i][0],vertices[i][1])
                    .build(),
                vertices[i-1][0],
                vertices[i][0]
            )
        );
    }
    result = functions.sum(
        result,
        functions.restrict(
            functions.constant(vertices[verticeCount-1][1]),
            vertices[verticeCount-1][0],
            NaN
        )
    );
    return result;
};
