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

  it("should check for $containsTypeInsensitive", function() {
    var constraints = {
      values: {
        $containsTypeInsensitive: "42"
      }
    };

    boolWrapper(constraints, {values: ['42', 'hello', 'bonjour']}).should.be.true;
    boolWrapper(constraints, {values: "42"}).should.be.true;
    boolWrapper(constraints, {values: [42, 'hello', 'bonjour']}).should.be.true;
    boolWrapper(constraints, {values: 42}).should.be.true;
    boolWrapper(constraints, {values: ['43']}).should.not.be.true;
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

  it("should check for $missing", function() {
    var constraints = {
      values: {
        $missing: true
      }
    };

    boolWrapper(constraints, {values: "hello"}).should.not.be.true;
    boolWrapper(constraints, {}).should.be.true;
  });

  it("should check for $empty", function() {
    var constraints = {
      values: {
        $empty: true
      }
    };

    boolWrapper(constraints, {values: []}).should.be.true;
    boolWrapper(constraints, {values: [1]}).should.not.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });

  it("should check for $empty allowing missing", function() {
    var constraints = {
      values: {
        $empty: 'allowMissing'
      }
    };

    boolWrapper(constraints, {values: []}).should.be.true;
    boolWrapper(constraints, {values: [1]}).should.not.be.true;
    boolWrapper(constraints, {}).should.be.true;
  });

  it("should check for $notEmpty", function() {
    var constraints = {
      values: {
        $notEmpty: true
      }
    };

    boolWrapper(constraints, {values: []}).should.not.be.true;
    boolWrapper(constraints, {values: [1]}).should.be.true;
    boolWrapper(constraints, {}).should.not.be.true;
  });

  it("should use $match shortcut", function() {
    var constraints = {
      values: /h.+o/
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

  it("should fail for unknown constraints", function() {
    var constraints = {
      name: {
        $foo: "tsointsoin"
      }
    };

    boolWrapper(constraints, {name: "lol"}).should.not.be.true;
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


describe("README is up to date", function() {
  // Read the README and check examples works as advertised.
  var readme = require('fs').readFileSync(__dirname + '/../README.md').toString();
  var code = readme.match(/```javascript((.|\n)+)```/)[1];
  code.split(/\/\*/).slice(1).forEach(function(testSection) {
    var title = testSection.substr(0, testSection.indexOf('*'));
    var code = testSection.substr(testSection.indexOf("\n"));

    // replace throws
    code = "var passed = false;\n" + code;
    code = code.replace(/\n(.+) \/\/ throw/g, function(matches, code) {
      return "\ntry {" + code + "} catch(e) { passed=true} if(!passed) { throw new Error('Test failed:" + code + "')}; //";
    });

    it(title, function() {
      eval(code);
    });
  });
});
