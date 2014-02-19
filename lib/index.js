"use strict";


function matchConstraint(constraint, value) {
  if(typeof(constraint) === 'string') {
    if(value !== constraint) {
      return value + " does not equals " + constraint;
    }
    return;
  }

  if(constraint["$contains"]) {
    var contains = constraint["$contains"];
    value = [].concat(value);
    if(value.indexOf(contains) === -1) {
      return value + "does not contains " + contains;
    }

    return;
  }

  return "Unknown constraint: " + constraint;
}


function matchConstraints(constraints, object) {
  Object.keys(constraints).forEach(function(key) {
    if(!object[key]) {
      throw new Error( "[" + key + "]: object does not define the key.");
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
