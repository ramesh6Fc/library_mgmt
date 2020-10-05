const model = require('../models/userModel');
const Book = model.Book;
    
    exports.getBooks = async (req, res, next) => {
    const bookCriteria = {}
    if(req.query){
        req.query.book ? bookCriteria["book"] = req.query.book :"";
        req.query.author ? bookCriteria["author"] = req.query.author :"";
        req.query.publisher ? bookCriteria["publisher"] = req.query.publisher :"";
        req.query.bookCategory ? bookCriteria["bookCategory"] = req.query.bookCategory :"";
    }
    let bookList = await Book.find(bookCriteria);
    res.status(200).json({
     data: bookList
    });
   }

   exports.getBook = async (req, res, next) => {
    try {
     const bookId = req.params.bookId || req.body.id;
     let bookData = await Book.findById(bookId);
     if (!bookData) return res.status(401).json({ error: 'Book does not exist'});
      res.status(200).json({
      data: bookData
     });
    } catch (error) {
     next(error)
    }
   }

   exports.CheckBookNotLend = async (req, res, next) => {
    try {
     const checkBook = {book:req.body.book, isLended:false};
     let bookData = await Book.find(checkBook);
     if (!bookData) return next(new Error('The Book Not Available'));
     else return bookData;
    } catch (error) {
     return error;
    }
   }
    
   exports.createbook = async (req, res, next) => {
    try {
        let { book, author, publisher, bookCategory } = req.body
        let bookData = new Book({ book, author: author  || null, publisher: publisher  || null, bookCategory: bookCategory  || null, isLended: false});
        await bookData.save();
        res.status(200).json({
            data: bookData,
            message: 'Book has been created'
           });
       } catch (error) {
        return error
       }
    }
    
   exports.updateBook = async (req, res, next) => {
    try {
     const update = req.body
     const bookId = req.params.bookId || req.body.id;
     await Book.findByIdAndUpdate(bookId, update);
     let bookData = await Book.findById(bookId)
     res.status(200).json({
      data: bookData,
      message: 'Book has been updated'
     });
    } catch (error) {
     return error
    }
   }
    
   exports.deleteBook = async (req, res, next) => {
    try {
     const id = req.params.bookId || req.body.id;;
     await Book.findByIdAndDelete(id);
     res.status(200).json({
      data: null,
      message: 'Book has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }
    