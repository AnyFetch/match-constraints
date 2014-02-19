Match Constraints
=======================
![Build Status](https://travis-ci.org/Papiel/match-constraints.png)
![Coverage Status](https://coveralls.io/repos/Papiel/match-constraints/badge.png?branch=master)
[![NPM version](https://badge.fury.io/js/anyfetch-file-hydrater.png)](http://badge.fury.io/js/match-constraint)

Check a JS object match specified constraints.
This is for simple object matching. If you require more advanced manipulation, other libraries can be fine

## Install
```sh
$ npm install match-constraints
```

## Usage
```
// You may use matchConstraints to throw errors on constraints failures, ot matchConstraintsBool to return false on failures.
var matchConstraints = require('match-constraints').matchConstraints;


/* Simple use case */
var constraints = {
    name: "hello"
};

matchConstraints(constraints, {name: "hello", foo: "bar"}); // OK
matchConstraints(constraints, {name: "helo", foo: "bar"}); // throws Error: "[name]: helo does not equals hello"

/* $match : regexp checks */
var constraints = {
    name: {
        $match: /h.+o$/
    }
};

matchConstraints(constraints, {name: "hello", foo: "bar"}); // OK
matchConstraints(constraints, {name: "hellos", foo: "bar"}); // throws Error "[name]: hellos does not match /h.+o$/"

/* $contains: array checks */
var constraints = {
    values: {
        $contains: 4
    }
};

matchConstraints(constraints, {values: [1, 2, 3, 4]}); // OK
matchConstraints(constraints, {values: 4}); // OK
matchConstraints(constraints, {values: [1, 2, 3]}); // throws Error "[values]: 1,2,3 does not contains 4"

/* Recursive matching */
var constraints = {
    values: {
        foo: {
            $contains: 4
        }
    }
};

matchConstraints(constraints, {name: "hello", values: {foo: [1, 2, 3, 4]}}); // OK
matchConstraints(constraints, {values: [1, 2, 3, 4]}); // throws Error "[foo]: object does not define the key"```
```
