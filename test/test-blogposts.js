'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
// const faker = require('faker');
const mongoose = require('mongoose');
const seedData = require('../seed-data.json');
// const expect = chai.expect;
const should = chai.should();

const { BlogPost } = require('../models');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');


chai.use(chaiHttp);

before(function() {
  console.log('runServer');
  return runServer(TEST_DATABASE_URL);
});

beforeEach(function() {
  console.log('seeding data');
  return BlogPost.insertMany(seedData);
});

afterEach(function() {
  console.log('dropping database');
  return mongoose.connection.dropDatabase();
});

//server gets closed after describe block
after(function() {
  console.log('closeServer');
  return closeServer();
});

describe('GET: Checks that the get returns same number of entries as in the BlogDb', function() {
  it('should return all existing blogDB', function() {
    let response;
    return chai.request(app)
      .get('/posts')
      .then(function(_res) {
        response = _res;
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.be.at.least(1);
        return BlogPost.count();
      })
      .then(function(count) {
        console.log('The count is =' + count);
        response.body.should.have.length(count);
      });
  }); //end it statement
}); //end describe


//GET endpoint test
// describe('GET: Get objects in BlogDb', function() {
//   it('should return all blog entries', function() {
//     return chai.request(app)
//     .get('/posts')


//   });//end it statement
//   // it('should return all blog entries', function() {
//   //   return true.should.be.true;
//   // });

// }); //end describe for GET