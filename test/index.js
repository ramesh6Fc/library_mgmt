const test = require('tape');
const request = require('supertest');
const app = require('../app/server');
let token = null;
let noramalUserToken = null;
let bookId = null;
let book2Id = null;
// _____1
test('List users without login', function (t) {
    request(app)
      .get('/users')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        t.error(err,"You need to be logged in to access this route");
        t.end();
      });
  }); 

  // ***********************Admin user access****************************************

  // _____2
  test('Login before signup', function (t) {
    request(app)
    .post('/login')
    .send({"email":"MaryMa@abc.com","password":"abcdR66cgf"})
      .expect(401)
      .end(function (err, res) {
        t.error(err,"Email does not exist");
        t.end();
      });
  }); 

  // _____3
  test('Signup as a admin user', function (t) {
    token = null;
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

  // _____4
  test('List users api with admin token', function (t) {
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

  // _____5
  test('Login as a admin user', function (t) {
    request(app)
    .post('/login')
    .send({"email":"MaryMa@abc.com","password":"abcdR66cgf"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'admin');
        token = res.body.data.accessToken;
        t.end();
      });
  }); 

  // _____6
  test('List books by admin token', function (t) {
    request(app)
    .get('/books')
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(res.body.error, "You don't have enough permission to perform this action" || "You need to be logged in to access this route");
            t.end();
      });
  }); 

  // _____7
  test('Add a book by admin user', function (t) {
    request(app)
    .post('/book')
    .send({"book":"Queen bird","author":"King Maddy", "publisher": "Venus Publications","bookCategory": "Romance"})
    .set({"x-access-token":token})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.message,'Book has been created');
        bookId = res.body.data._id
        t.end();
      });
  }); 
// _____7.1
  test('Add another book by admin user', function (t) {
    request(app)
    .post('/book')
    .send({"book":"Red Sky","author":"John Preto", "publisher": "Eag Publications","bookCategory": "War"})
    .set({"x-access-token":token})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.message,'Book has been created');
        book2Id =  res.body.data._id;
        t.end();
      });
  }); 
  
  // _____8
  test('Update the existing book by admin user', function (t) {
    request(app)
    .put('/book')
    .send({id: bookId,"book":"Queen Bird","author":"King Maddy", "publisher": "Jupiter Publications", "bookCategory": "Romance"})
    .set({"x-access-token":token})
        .expect(200)
        .end(function (err, res) {
         t.isEqual(res.body.message,'Book has been updated');
          t.end();
      });
  }); 
  
// _____9
  test('Get the updated book while ago by admin user', function (t) {
    request(app)
    .get('/book')
    .send({id: bookId})
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
           t.isEqual(res.body.data._id, bookId);
            t.end();
      });
  }); 

  // _____10
  test('Delete a book by admin user', function (t) {
    request(app)
    .delete('/book')
    .send({id: bookId})
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          t.isEqual(res.body.message,'Book has been deleted');
          t.end();
      });
  }); 

 // **********************************Normal user actions *****************************************

 // _____11
 test('Login as a normal user', function (t) {
  request(app)
    .post('/login')
    .send({"email":"rajaram@abc.com","password":"1234567890"})
    .set('Accept', 'application/json')
    .expect(401)
    .end(function (err, res) {
      t.error(err,"Email does not exist");
      t.end();
    });
}); 

// _____12
  test('Signup as a normal user', function (t) {
    request(app)
      .post('/signup')
      .send({"email":"rajaram@abc.com","password":"1234567890","fName":"Raja", "lName":"Mohan", "role": "user"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'user');
        noramalUserToken = res.body.accessToken
        t.end();
      });
  }); 

  // _____13
  test('List users by normal user token', function (t) {
    request(app)
    .get('/users')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
            t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  // _____14
  test('Login as a normal user', function (t) {
    request(app)
      .post('/login')
      .send({"email":"rajaram@abc.com","password":"1234567890"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'user');
        noramalUserToken = res.body.data.accessToken
        t.end();
      });
  }); 

  // _____15
  test('View my profile', function (t) {
    request(app)
    .get('/user')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          t.isEqual(res.body.data.role,'user');
            t.end();
      });
  }); 

  // _____16
  test('List books by normal user token after login', function (t) {
    request(app)
    .get('/books')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  // _____17
  test('Add a book by normal user', function (t) {
    request(app)
    .post('/book')
    .set({"x-access-token":noramalUserToken})
    .send({"book":"Red Sky","author":"John Preto", "publisher": "Eag Publications","bookCategory": "War"})
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        t.error(err,"You don't have enough permission to perform this action");
        t.end();
      });
  }); 
  
  // _____18
  test("Get a selected book's details by normal user", function (t) {
    request(app)
    .get('/book')
    .send({id: book2Id})
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          t.isNotEqual(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 
  
  // _____19
  test('Update the existing book by normal user', function (t) {
    request(app)
    .put('/book/bookId')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  // _____20
  test('Delete a book by normal user', function (t) {
    request(app)
    .delete('/book/bookId')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  // _____21
  test('Lend a book by normal user', function (t) {
    request(app)
    .put('/lendBook')
    .send({"book":"Red Sky","author":"John Preto", "publisher": "Eag Publications","bookCategory": "War"})
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isEqual(res.body.message, 'Book has been updated');
            t.end();
      });
  }); 

  // _____22
  test('Try to lend already lended book by normal user', function (t) {
    request(app)
    .put('/lendBook')
    .send({"book":"Red Sky","author":"John Preto", "publisher": "Eag Publications","bookCategory": "War"})
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isEqual(res.body.message, 'The Book Not Available');
            t.end();
      });
  }); 

  // _____23
  test('Get my books', function (t) {
    request(app)
    .get('/mybooks')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(res.body.message, 'The Book Not Available');
            t.end();
      });
  }); 

  // ************************************************************************