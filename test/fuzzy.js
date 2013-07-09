'use strict';

var chai = require('chai');
var expect = chai.expect;

var functions = require('../src/functions');
var fuzzy = require('../src/fuzzy');

describe('fuzzy logic', function () {
    var speedDefinition;

    beforeEach(function() {
        speedDefinition = new fuzzy.LinguisticVariableDefinition(
            'speed',
            [
                new fuzzy.LinguisticValueDefinition(
                    'low',
                    functions.piecewise([30,1], [50,0])
                ),
                new fuzzy.LinguisticValueDefinition(
                    'medium',
                    functions.piecewise([20,0], [60,1],[100,0])
                ),
                new fuzzy.LinguisticValueDefinition(
                    'high',
                    functions.piecewise([80,0], [120,1])
                )
            ]
        );
    });

    it('should fuzzify low speed', function () {
        var fuzzySpeed = speedDefinition.fuzzify(0);
        expect(fuzzySpeed.getValue('low')).to.closeTo(1, 0.001);
        expect(fuzzySpeed.getValue('medium')).to.closeTo(0, 0.001);
        expect(fuzzySpeed.getValue('high')).to.closeTo(0, 0.001);
    });

    it('should fuzzify medium speed', function () {
        var fuzzySpeed = speedDefinition.fuzzify(45);
        expect(fuzzySpeed.getValue('low')).to.closeTo(0.25, 0.001);
        expect(fuzzySpeed.getValue('medium')).to.closeTo(0.625, 0.001);
        expect(fuzzySpeed.getValue('high')).to.closeTo(0, 0.001);
    });

    it('should fuzzify high speed', function () {
        var fuzzySpeed = speedDefinition.fuzzify(150);
        expect(fuzzySpeed.getValue('low')).to.closeTo(0, 0.001);
        expect(fuzzySpeed.getValue('medium')).to.closeTo(0, 0.001);
        expect(fuzzySpeed.getValue('high')).to.closeTo(1, 0.001);
    });
});
