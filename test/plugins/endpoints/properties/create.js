/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Server = require('../../../../lib/server');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });
  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });
  it('should create a property', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'test', address: '123 broadway ave'}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('test');
      expect(response.result.address).to.equal('123 broadway ave');
      expect(response.result.createdAt).to.be.instanceof(Date);
      expect(response.result.__v).to.be.a('number');
      expect(response.result.managerId.toString()).to.have.length(24);
      expect(response.result.managerId.toString()).to.equal('a00000000000000000000001');
      done();
    });
  });
  it('should throw an error when invalid information', function(done){
    server.inject({method: 'POST', url: '/properties', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'ab', address: '1'}}, function(response){
      expect(response.statusCode).to.equal(400);
      done();
    });
  });
  it('should throw an error when no userId', function(done){
    server.inject({method: 'POST', url: '/properties', payload: {name: 'abcd', address: '1sdfsdfsfas'}}, function(response){
      expect(response.statusCode).to.equal(401);
      done();
    });
  });
});
