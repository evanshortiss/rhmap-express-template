'use strict';

var expect = require('chai').expect
  , supertest = require('supertest');


describe(__filename, function () {
  var request
    , app;

  beforeEach(function () {
    // Create a new express application for each test case
    app = require('express')();

    // Remove cached copies of the route
    delete require.cache[require.resolve('./hello.js')];

    // Init the route
    require('./hello.js')(app);

    // Initialise a supertest instance with our application
    request = supertest(app);
  });


  it('should load successfully and export function', function () {
    var mod = require('./hello.js');
    expect(mod).to.be.a('function');
  });


  describe('POST /hello', function () {
    it('should get 200 with msg', function (done) {
      request
        .post('/hello')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Aloha, World');
          done();
        });
    });

    it('should get 200 with custom msg', function (done) {
      request
        .post('/hello')
        .expect(200)
        .expect('Content-Type', /json/)
        .send({
          hello: 'Shadowman'
        })
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Aloha, Shadowman');
          done();
        });
    });
  });

  describe('GET /hello', function () {
    it('should get 200 with msg', function (done) {
      request
        .get('/hello')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Aloha, World');
          done();
        });
    });

    it('should get 200 with custom msg', function (done) {
      request
        .get('/hello?hello=Shadowman')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(err).to.be.null;
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('msg');
          expect(res.body.msg).to.equal('Aloha, Shadowman');
          done();
        });
    });
  });

});
