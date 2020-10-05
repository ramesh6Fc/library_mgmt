const test = require('tape');
const request = require('supertest');
const app = require('../app/server');
let token = null;
let noramalUserToken = null;
let bookId = null;

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
  test('Login before signup', function (t) {
    request(app)
    .post('/login')
    .send({"email":"MaryMa@abc.com","password":"abcdR66cgf"})
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        t.error(err,"Email does not exist");
        token = res.body.data.accessToken;
        t.end();
      });
  }); 

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

  test('Add a book by admin user', function (t) {
    request(app)
    .post('/book')
    .send({"book":"Queen bird","author":"King Maddy", "publisher": "Venus Publications","bookCategory": "Romance"})
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.message,'Book has been created');
        bookId = res.body.data._id
        t.end();
      });
  }); 
  
  test('Update the existing book by admin user', function (t) {
    request(app)
    .put('/book/:'+bookId)
    .send({"book":"Queen Bird","author":"King Maddy", "publisher": "Jupiter Publications"})
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          t.isEqual(res.body.message,'Book has been updated');
          t.end();
      });
  }); 
  

  test('Get the updated book while ago by admin user', function (t) {
    request(app)
    .get('/book/:'+bookId)
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.Equal(res.body.data._id, bookId);
            t.end();
      });
  }); 

  test('Delete a book by admin user', function (t) {
    request(app)
    .delete('/book/:'+bookId)
    .set({"x-access-token":token})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          t.isEqual(res.body.message,'Book has been deleted');
            t.end();
      });
  }); 

 // **********************************Normal user actions *****************************************
 test('Login as a normal user', function (t) {
  request(app)
    .post('/signup')
    .send({"email":"rajaram@abc.com","password":"1234567890"})
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      t.isEqual(res.body.data.role,'user');
      noramalUserToken = res.body.accessToken
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
        noramalUserToken = res.body.accessToken
        t.end();
      });
  }); 

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

  test('Login as a normal user', function (t) {
    request(app)
      .post('/login')
      .send({"email":"rajaram@abc.com","password":"1234567890"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        t.isEqual(res.body.data.role,'user');
        noramalUserToken = res.body.accessToken
        t.end();
      });
  }); 

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

  test('List books by normal user token after login', function (t) {
    request(app)
    .get('/books')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
            t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

  test('Add a book by normal user', function (t) {
    request(app)
    .post('/book')
    .set({"x-access-token":noramalUserToken})
    .send({"book":"Red Sky","author":"John Preto", "publisher": "Eag Publications","bookCategory": "War"})
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function (err, res) {
        t.error(err,"You don't have enough permission to perform this action");
        bookId = res.body.data._id
        t.end();
      });
  }); 
  
  
  test("Get a selected book's details by normal user", function (t) {
    request(app)
    .get('/book/'+bookId)
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 
  
  test('Update the existing book by normal user', function (t) {
    request(app)
    .put('/book/'+bookId)
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          t.error(err,"You don't have enough permission to perform this action");
            t.end();
      });
  }); 

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

  test('Lend a book by normal user', function (t) {
    request(app)
    .put('/lendBook')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(res.body.message, 'Book has been updated');
            t.end();
      });
  }); 

  
  test('Try to lend already lended book by normal user', function (t) {
    request(app)
    .put('/lendBook')
    .set({"x-access-token":noramalUserToken})
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
            t.isNotEqual(res.body.message, 'The Book Not Available');
            t.end();
      });
  }); 

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