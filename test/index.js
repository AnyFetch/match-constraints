"use strict";

require("should");

var lib = require('../lib');
var matchConstraints = lib.matchConstraints;
var matchConstraintsBool = lib.matchConstraintsBool;


// Return true, or the error if any.
function boolWrapper(constraints, object) {
  var r = matchConstraintsBool(constraints, object);
  if(r) {
    return r;
  }

  try {
    matchConstraints(constraints, object);
  }
  catch(e) {
    return e.toString();
  }

  throw new Error("No reason to reach this point.");
}


describe("Match objects checker", function() {
  it("should check for property value", function() {
    var constraints = {
      name: "hello"
    };

    boolWrapper(constraints, {name: "hello"}).should.be.true;
    boolWrapper(constraints, {name: "hllo"}).should.not.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });

  it("should check for $contains", function() {
    var constraints = {
      values: {
        $contains: "hello"
      }
    };

    boolWrapper(constraints, {values: ['hi', 'hello', 'bonjour']}).should.be.true;
    boolWrapper(constraints, {values: "hello"}).should.be.true;
    boolWrapper(constraints, {values: ['hi']}).should.not.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });

  it("should check for $match", function() {
    var constraints = {
      values: {
        $match: /h.+o/
      }
    };

    boolWrapper(constraints, {values: "hello"}).should.be.true;
    boolWrapper(constraints, {values: "lol"}).should.not.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });
});
