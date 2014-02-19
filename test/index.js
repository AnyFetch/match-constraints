"use strict";

require("should");

var lib = require('../lib');
var matchConstraints = lib.matchConstraints;
var matchConstraintsBool = lib.matchConstraintsBool;

describe("Match objects checker", function() {
  it("should check for property value", function() {
    var constraints = {
      name: "hello"
    };

    matchConstraintsBool(constraints, {name: "hello"}).should.be.true;
    matchConstraintsBool(constraints, {name: "hllo"}).should.be.false;
    matchConstraintsBool(constraints, {}).should.be.false;
  });
});
