/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var CP = require('child_process');
var Path = require('path');
var Sinon = require('sinon');
var Server = require('../../../../lib/server');
var Property = require('../../../../lib/models/property');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;

var server;

describe('GET /properties', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  beforeEach(function(done){
    var db = server.app.environment.MONGO_URL.split('/')[3];
    CP.execFile(Path.join(__dirname, '../../../../scripts/clean-db.sh'), [db], {cwd: Path.join(__dirname, '../../../../scripts')}, function(){
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should return a property', function(done){
    server.inject({method: 'GET', url: '/properties/{propertyId}', credentials: {_id: 'b00000000000000000000001', managerId: 'a00000000000000000000001'}}, function(response){
      expect(response.result).to.ok;
      done();
    });
  });

  it('should return falsy', function(done){
    server.inject({method: 'GET', url: '/properties/{propertyId}', credentials: {_id: 'b00000000000000000000011'}}, function(response){
      expect(response.result.property.value).to.not.be.ok;
      done();
    });
  });
  it('should return falsy', function(done){
    var stub = Sinon.stub(Property, 'find').yields(new Error());
    server.inject({method: 'GET', url: '/properties/{propertyId}', credentials: {_id: 'b00000000000000000000001', managerId: 'a00000000000000000000009'}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
