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

  it("should work on subfields", function() {
    var constraints = {
      sub: {
        name: "hello"
      }
    };

    boolWrapper(constraints, {sub: {name: "hello"}}).should.be.true;
    boolWrapper(constraints, {sub: {name: "lol"}}).should.not.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });
});

describe("Functional tests", function() {
  it("should work on complex use case", function() {
    // use case from anyfetch.com
    var constraints = {
      documentType: {
        name: "file"
      },
      metadatas: {
        path: {
          $match: /\.doc$/
        }
      },
      hydratedBy: {
        $contains: 'http://plaintext.hydrater.anyfetch.com'
      }
    };

    boolWrapper(constraints, {documentType: {id: 123, name: "file"}, metadatas: {path: "/home/document.doc"}, hydratedBy: ['http://plaintext.hydrater.anyfetch.com']}).should.be.true;
    boolWrapper(constraints, {documentType: {id: 123, name: "file"}, metadatas: {path: "/home/document.doc"}, hydratedBy: ['http://plaintext.hydrater.anyfetch.com', 'hello there']}).should.be.true;
    boolWrapper(constraints, {documentType: {id: 123, name: "document"}, metadatas: {path: "/home/document.doc"}, hydratedBy: ['http://plaintext.hydrater.anyfetch.com']}).should.not.be.true;
    boolWrapper(constraints, {documentType: {id: 123, name: "file"}, metadatas: {path: "/home/document.docx"}, hydratedBy: ['http://plaintext.hydrater.anyfetch.com']}).should.not.be.true;
    boolWrapper(constraints, {metadatas: {path: "/home/document.doc"}}).should.not.be.true;
    boolWrapper(constraints, {documentType: {id: 123, name: "file"}, metadatas: {path: "/home/document.doc"}}).should.not.be.true;
  });
});
