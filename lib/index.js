"use strict";


function matchConstraint(constraint, value) {
  if(typeof(constraint) === 'string') {
    if(value !== constraint) {
      return value + " does not equals " + constraint;
    }
    return;
  }

  if(constraint instanceof RegExp) {
    // $match shortcut notation
    constraint = {
      $match: constraint
    };
  }

  if(constraint.$contains) {
    var contains = constraint.$contains;
    value = [].concat(value);
    if(value.indexOf(contains) === -1) {
      return value + " does not contains " + contains;
    }

    return;
  }

  if(constraint.$match) {
    var regexp = constraint.$match;
    if(!value.match(regexp)) {
      return value + " does not match " + regexp.toString();
    }

    return;
  }

  if(constraint.$missing) {
    return value + " should not be defined";
  }

  if(constraint.$empty) {
    if(value && value.length !== 0) {
      return value + " is not empty";
    }

    return;
  }

  if(typeof(constraint) === "object" && typeof(value) === "object") {
    // Recursive constraint
    try {
      matchConstraints(constraint, value);
    }
    catch(e) {
      return e.toString();
    }

    return;
  }
  return "Unknown constraint: " + JSON.stringify(constraint);
}


function matchConstraints(constraints, object) {
  Object.keys(constraints).forEach(function(key) {
    if(!object[key]) {
      // Allow missing key only if $missing is set, or if $empty === 'allowMissing'
      if(!constraints[key].$missing && constraints[key].$empty !== 'allowMissing') {
        throw new Error( "[" + key + "]: object does not define the key.");
      }
      else {
        return;
      }
    }

    var ret = matchConstraint(constraints[key], object[key]);
    if(ret) {
      var error = "[" + key + "]: " + ret;
      throw new Error(error);
    }
  });
}


function matchConstraintsBool(constraints, object) {
  try {
    matchConstraints(constraints, object);
  }
  catch(e) {
    return false;
  }

  return true;
}


module.exports.matchConstraints = matchConstraints;
module.exports.matchConstraintsBool = matchConstraintsBool;
