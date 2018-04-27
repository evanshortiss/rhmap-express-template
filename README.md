# Red Hat Mobile Cloud Application Template
[![Circle CI](https://circleci.com/gh/evanshortiss/rhmap-express-template/tree/master.svg?style=svg)](https://circleci.com/gh/evanshortiss/rhmap-express-template/tree/master)

## Overview
This is a template express application that utilises the RHMAP (Red Hat Mobile
Application Platform) express middleware and demonstrates strong unit testing.
It is an http server that uses the express framework to expose a simple API.

The API exposes the following endpoints:

#### GET /users/:id
Get a user with the given ID, e.g GET http://127.0.0.1:8001/users/0.

#### POST /users/:id
Create a new user with the given ID, e.g POST http://127.0.0.1:8001/users/0,
and passing a body of type application/json.

#### PUT /users/:id
Update a user with the given ID, e.g PUT http://127.0.0.1:8001/users/0 and
pass in a JSON body with header "Content-Type: application/json".

```
{
  "firstname": "jane"
  "lastname": "doe"
}
```

For example, try this cURL from a terminal:

```
curl -X POST --data '{"lastname":"linux"}' -H "Content-Type:application/json" http://127.0.0.1:8001/users/0
```

And now call this to see the change was saved:

```
curl http://127.0.0.1:8001/users/0
```

## Requirements

 * node.js v0.10.30
 * npm
 * redis

## Install Dependencies
Before trying to run this application you'll need to install the dependencies.
You can do so by typing _npm install_ in the project directory.

## Running Project Tasks
Rather than using a task runner like _gulp_, _grunt_, or whichever other task
runner you're familiar with, we've chosen to simply use the _package.json_
"scripts" that npm supports. This makes it easy to use local dependencies and
reduce bloat. Of course, this project can easily be modified to use your
favourite task runner if you like.

Scripts can be run by typing:

```
npm run-script {SCRIPT_NAME}
```

#### Scripts
You can view the _package.json_ to see the scripts in detail , but here's a
breakdown of each.

##### start
Start the application, e.g _npm start_

##### jshint
Check code quality using JSHint.

##### test
Execute JSHint, unit tests, and verification of code coverage. This would
make sense to run on a CI server.

##### coverage
Execute unit tests and generate code coverage from them.

##### check-coverage
Verify that code coverage is above a certain threshold.

##### unit
Execute the unit tests.




## Starting the Server
This template contains an entry point, _application.js_ that can be started by
typing _npm start_. You can also start the application using
_node application.js_, but this will not set the NODE_PATH environment
variable and will therefore cause _require_ paths to be deemed incorrect.

## Application Structure
This application is a fairly typical express application, but unlike many
examples you might find online, the entire route logic is not contained in
single file. Why not? Because that's an awful thing to do in a complex real
world application.

We've broken our application down into routers, and modules that handle
application logic. If you read _lib/routes/users.js_ you'll see that the
majority of the logic it performs is HTTP related, and we allow another module
do the real "users" related work. Why do this? Well, we've a few reasons:

#### 1. Readability
The code doesn't sprawl into callback hell, etc. It's also easier to reason
about code that is concise.

#### 2. Testability
Modular code is much easier to thoroughly test. Mocking out all the potential
scenarios and paths in a 200 line function is tough, but for a 20 line function
it's pretty easy.

#### 3. Separation of Concerns
Why make a router, something that is responsible for glue-ing application logic
to HTTP, be responsible for all the heavy lifting?


## Querying the Server
To issue a request to the express server type _http://127.0.0.1:8001/users/1_
into the address bar of your web browser. If it works a JSON object will be
returned contain one of our sample users from _lib/users/index.js_. Remember
to start the application first by typing _npm run-script serve_.

## Running the Unit Tests
Issue the command _npm run-script unit_ to run unit tests that are included.

The unit tests do the following:

* Tests our users interface _lib/users/index.js_
* Tests our users router _lib/routers/users.js_
* Tests our users route handling logic  _lib/route-handlers/users.js_

## Determine Code Coverage
Code coverage can be obtained by running _npm test_. This also runs the unit
tests, since this is required to determine code coverage. This application has
100% code coverage. This does not mean it contains absolutely no errors, but
it does mean you can be more confident in using it.

Code coverage for this application is generated using thr _istanbul_ tool.


## Test Structure

#### Mocha
We use the Mocha test framework to structure our tests. Mocha is popular,
mature, and has support for asynchronous test cases.

Here's a sample test case:

```js
var assert = require('assert');

describe('userModule', function () {
  describe('#someFunction', function () {
    it('should exec successfully', function () {
      var result = require('./users').someFunction();

      assert.equal(result, 'some test result');
    })
  });
});
```

and here's the same test if it was asynchronous i.e it performs some I/O bound
operation, or something wrapped in a _setTimeout/setImmediate/process.nextTick_.
Notice we have Mocha inject a _done_ callback, that we can be call to signify
our test has completed.

```js
var assert = require('assert');

describe('userModule', function () {
  describe('#someFunction', function () {
    it('should exec successfully', function (done) {
      var result = require('./users').someFunction(function (error, result) {
        assert.equal(result, 'some test result');

        // Not calling this makes the test fail after 2 seconds (default timer)
        done();
      });
    })
  });
});
```

#### Mocking Dependencies
To mock out dependencies we use _proxyquire_ and _sinon_. _proxyquire_ allows
you to use it in place of the _require_ statement to load a module, and stub
out some of its dependencies. By doing this we can force certain scenarios to
occur, andtherefore simplify testing. _sinon_ can create our stubs that we will
injectusing _proxyquire_, and as a result allow us to mock out the behaviour of
dependencies using a common framework.

#### Express Router Tests
There are many methods available for testing express router logic. You can:

1. Use the _supertest_ module
2. Start the application.js and make real HTTP requests to it
3. Manually invoke route handlers

We've used option #1 from the list above since it affords us a number of
advantages:

1. We can easily mock out dependencies using techniques discussed earlier
2. No need to run the web service and make "real" HTTP calls like you would
with option #2
3. Routes can be tested in isolation since we don't run the entire application,
assuming we create our routes modules as functions that must be invoked with an
express object passed in
4. Requests will be run through the express middleware stack so request objects
we test with will be identical to real world counterparts.


