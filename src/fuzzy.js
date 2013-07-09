'use strict';

var functions = require('./functions');

var LinguisticValueDefinition = function(name, membershipFunction) {
    this.name = name;
    this.func = membershipFunction;
};

var LinguisticValue = function(linguisticValueDefinition, sharpValue) {
    this.definition = linguisticValueDefinition;
    this.membership = this.definition.func(sharpValue);
    this.func = functions.min(
        functions.constant(this.membership),
        linguisticValueDefinition.func
    );
};

var LinguisticVariableDefinition = function(name, linguisticValueDefinitions) {
    this.name = name;
    this.valueDefinitions = linguisticValueDefinitions;
};

var LinguisticVariable = function(linguisticVariableDefinition, sharpValue) {
    this.definition = linguisticVariableDefinition;
    this.sharpValue = sharpValue;
    this.linguisticValues = this.definition.valueDefinitions.map(
        function(linguisticValueDefinition) {
            return new LinguisticValue(
                linguisticValueDefinition,
                sharpValue
            );
        }
    );
};

LinguisticVariable.prototype.getValue = function(name) {
    var i;
    for (i=0; i<this.linguisticValues.length; ++i) {
        if (name === this.linguisticValues[i].definition.name) {
            return this.linguisticValues[i].membership;
        }
    }
    return NaN;
};

LinguisticVariableDefinition.prototype.fuzzify = function(sharpValue) {
    return new LinguisticVariable(this, sharpValue);
};

var FuzzySet = function(membershipFunction) {
    this.func = membershipFunction;
};

FuzzySet.prototype.union = function(other) {
    return new FuzzySet(
        functions.max(this.func, other.func)
    );
};

FuzzySet.prototype.intersect = function(other) {
    return new FuzzySet(
        functions.min(this.func, other.func)
    );
};

module.exports = {
    LinguisticVariableDefinition: LinguisticVariableDefinition,
    LinguisticValueDefinition: LinguisticValueDefinition,
    FuzzySet: FuzzySet
};
