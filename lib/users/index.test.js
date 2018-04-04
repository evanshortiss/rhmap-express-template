'use strict';

var proxyquire = require('proxyquire')
  , expect = require('chai').expect
  , sinon = require('sinon');

describe(__filename, function () {

  var mod, cacheStub, testUser;

  beforeEach(function () {
    cacheStub = sinon.stub();

    testUser = {
      firstname: 'shadow'
    };

    // Get a new instance each time
    delete require.cache[require.resolve('./index.js')];
    mod = proxyquire('./index.js', {
      'fh-mbaas-api': {
        'cache': cacheStub
      }
    });
  });

  describe('#getUser', function () {
    it('should return a user', function (done) {
      cacheStub.yields(null, JSON.stringify(testUser));

      mod.getUser('0', function (err, u) {
        expect(err).to.be.null;
        expect(u).to.be.an('object');
        expect(u).to.have.property('firstname');

        expect(cacheStub.called).to.be.true;

        done();
      });
    });

    it('should return null', function (done) {
      cacheStub.yields(null, null);

      mod.getUser('5670', function (err, u) {
        expect(u).to.not.exist;
        expect(err).to.be.null;

        expect(cacheStub.called).to.be.true;

        done();
      });
    });
  });

  describe('#updateById', function () {
    it('should update a user', function (done) {
      cacheStub.onCall(0).yields(null, JSON.stringify(testUser));
      cacheStub.onCall(1).yields(null, null);

      mod.updateById('0', {
        firstname: 'node.js'
      }, function (err, u) {
        expect(u).to.be.an('object');
        expect(u).to.have.property('firstname');
        expect(u.firstname).to.equal('node.js');

        done();
      });
    });

    it('should return an error due to getUser failure', function (done) {
      cacheStub.onCall(0).yields(new Error('connection failed'), null);

      mod.updateById('0', {
        firstname: 'node.js'
      }, function (err, u) {
        expect(err).to.be.an('object');
        expect(err.toString()).to.contain('connection failed');
        expect(u).to.not.exist;

        expect(cacheStub.calledOnce).to.be.true;

        done();
      });
    });

    it('should return null due to non-existent user', function (done) {
      cacheStub.onCall(0).yields(null, null);

      mod.updateById('0', {
        firstname: 'node.js'
      }, function (err, u) {
        expect(u).to.be.null;
        expect(err).to.be.null;

        done();
      });
    });

    it('should return an error due to writeUser failure', function (done) {
      cacheStub.onCall(0).yields(null, JSON.stringify(testUser));
      cacheStub.onCall(1).yields(new Error('connection failed'), null);

      mod.updateById('0', {
        firstname: 'node.js'
      }, function (err, u) {
        expect(err).to.be.an('object');
        expect(err.toString()).to.contain('connection failed');
        expect(u).to.not.exist;

        expect(cacheStub.calledTwice).to.be.true;

        done();
      });
    });
  });

  // describe('#writeUser', function () {
  //   var badData = {};

  //   // Create a circular reference. This can't be stringified
  //   badData.badData = badData;

  //   it('should fail due to inability to stringify', function (done) {
  //     mod.writeUser('id', badData, function (err, data) {
  //       expect(err).to.be.an('object');
  //       expect(err.toString()).to.include('failed to stringify user data');
  //       expect(data).to.not.exist;

  //       done();
  //     });
  //   });
  // });

});
