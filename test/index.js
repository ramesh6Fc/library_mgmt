const test = require('tape');
const request = require('supertest');
const app = require('../app/server');
var token = null;

test('Access list users api without login', function (t) {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        t.error(err,"You need to be logged in to access this route");
        t.end();
      });
  }); 
  test('Signup as a normal user', function (t) {
    request(app)
      .post('/signup')
      .send({"email":"rajaram@abc.com","password":"1234567890","fName":"Raja", "lName":"Mohan", "role": "user"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'user');
        token = res.body.accessToken
        t.end();
      });
  }); 

  test('Access list users api with normal user token', function (t) {
    request(app)
    .get('/users')
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
            t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  test('Signup as a admin user', function (t) {
    request(app)
    .post('/signup')
    .send({"email":"MaryMa@abc.com","password":"abcdR66cgf","fName":"Marry", "lName":"Maharaj", "role": "admin"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'admin');
        token = res.body.data.accessToken;
        t.end();
      });
  }); 
  test('Access list users api with admin token', function (t) {
    request(app)
    .get('/users')
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(res.body.error, "You don't have enough permission to perform this action" || "You need to be logged in to access this route");
            t.end();
      });
  }); 