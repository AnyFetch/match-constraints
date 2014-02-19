"use strict";

require("should");

var lib = require('../lib');
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

  it("should check for $contains", function() {
    var constraints = {
      values: {
        "$contains": "hello"
      }
    };

    matchConstraintsBool(constraints, {values: ['hi', 'hello', 'bonjour']}).should.be.true;
    matchConstraintsBool(constraints, {values: "hello"}).should.be.true;
    matchConstraintsBool(constraints, {values: ['hi']}).should.be.false;
  });
});
