"use strict";

require("should");

var matchConstraints = require('../lib');

describe("Match objects checker", function() {
  it("should check for property value", function() {
    var constraints = {
      name: "hello"
    };

    matchConstraints(constraints, {name: "hello"}).should.be.true;
    matchConstraints(constraints, {name: "hllo"}).should.be.false;
    matchConstraints(constraints, {}).should.be.false;
  });
});
