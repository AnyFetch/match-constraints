Match Constraints
=======================
![Build Status](https://travis-ci.org/AnyFetch/match-constraints.png)
![Coverage Status](https://coveralls.io/repos/AnyFetch/match-constraints/badge.png?branch=master)
[![NPM version](https://badge.fury.io/js/match-constraints.png)](http://badge.fury.io/js/match-constraints)

Check a JS object match specified constraints.
This is for simple object matching. If you require more advanced manipulation, other libraries will probably be better, see for instance `validator.js`.

## Install
```sh
$ npm install match-constraints
```

## Usage

```javascript
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

// Or shortcut notation
var constraints = {
    name: /h.+o$/
}
matchConstraints(constraints, {name: "hello", foo: "bar"}); // OK

/* $contains: array checks */
var constraints = {
    values: {
        $contains: 4
    }
};

matchConstraints(constraints, {values: [1, 2, 3, 4]}); // OK
matchConstraints(constraints, {values: 4}); // OK
matchConstraints(constraints, {values: [1, 2, 3]}); // throws Error "[values]: 1,2,3 does not contains 4"

/* $missing: existence checks */
var constraints = {
    notDefined: {
        $missing: true
    }
};

matchConstraints(constraints, {}); // OK
matchConstraints(constraints, {notDefined: [1, 2, 3, 4]}); // throws Error "[notDefined]: 1,2,3,4 should not be defined"

/* $empty: emptiness checks */
var constraints = {
    array: {
        $empty: true
    }
};

matchConstraints(constraints, {array: []}); // OK
matchConstraints(constraints, {array: [1, 2, 3, 4]}); // throws Error "[empty]: 1,2,3,4 is not empty"

/* Recursive matching */
var constraints = {
    values: {
        foo: {
            $contains: 4
        }
    }
};

matchConstraints(constraints, {name: "hello", values: {foo: [1, 2, 3, 4]}}); // OK
matchConstraints(constraints, {values: [1, 2, 3, 4]}); // throws Error "[foo]: object does not define the key"
```
