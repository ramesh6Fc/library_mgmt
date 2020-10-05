const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookController = require('../controllers/bookController');
const authorController = require('../controllers/authorController');
const publisherController = require('../controllers/publisherController');
 //Users creation
router.post('/signup', userController.signup);

//User login
router.post('/login', userController.login);
 
//Users
router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/user', userController.allowIfLoggedin, userController.getUser);
 
router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
 
router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);

router.put('/lendBook/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'lend'), userController.updateUserLend);
 
// Books
router.post('/book', userController.allowIfLoggedin, userController.grantAccess('createAny', 'book'),bookController.createbook);

router.get('/book/:bookId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'book'), bookController.getBook);

router.get('/books', userController.allowIfLoggedin, userController.grantAccess('readAny', 'book'), bookController.getBooks);
 
router.put('/book/:bookId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'book'), bookController.updateBook);
 
router.delete('/book/:bookId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'book'), bookController.deleteBook);
 
router.get('/mybooks', userController.allowIfLoggedin, userController.grantAccess('readOwn', 'books'), userController.getMybooks);

// Authors
router.post('/author', userController.allowIfLoggedin, userController.grantAccess('createAny', 'author'),authorController.createAuthor);

router.get('/authors', userController.allowIfLoggedin, userController.grantAccess('readAny', 'author'), authorController.getAuthors);
 
router.get('/author/:authorId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'author'), authorController.getAuthor);

router.put('/author/:authorId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'author'), authorController.updateAuthor);
 
router.delete('/author/:authorId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'author'), authorController.deleteAuthor);
 
// publishers
router.post('/publisher', userController.allowIfLoggedin, userController.grantAccess('createAny', 'publisher'),publisherController.createPublisher);

router.get('/publishers', userController.allowIfLoggedin, userController.grantAccess('readAny', 'publisher'), publisherController.getPublishers);
 
router.get('/publisher/:publisherId', userController.allowIfLoggedin, userController.grantAccess('readAny', 'publisher'), publisherController.getPublisher);

router.put('/publisher/:publisherId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'publisher'), publisherController.updatePublisher);
 
router.delete('/publisher/:publisherId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'publisher'), publisherController.deletePublisher);
 
module.exports = router;