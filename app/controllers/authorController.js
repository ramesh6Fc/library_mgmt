const model = require('../models/userModel');
const Author = model.Author;
    
    exports.getAuthors = async (req, res, next) => {
    let bookList = await Author.find({});
    res.status(200).json({
     data: bookList
    });
   }

   exports.getAuthor = async (req, res, next) => {
    try {
     const authorId = req.params.authorId;
     let authorData = await Author.findById(authorId);
     if (!authorData) return next(new Error('Author does not exist'));
      res.status(200).json({
      data: authorData
     });
    } catch (authorData) {
     next(error)
    }
   }
    
   exports.createAuthor = async (req, res, next) => {
    try {
        const { author, email } = req.body
        const authorData = new Author({ author, email});
        await authorData.save();
        res.status(200).json({
            data: authorData,
            message: 'Author has been created'
           });
       } catch (error) {
        next(error)
       }
    }
    
   exports.updateAuthor = async (req, res, next) => {
    try {
     const update = req.body
     const authorId = req.params.authorId;
     await Author.findByIdAndUpdate(authorId, update);
     let authorData = await Author.findById(authorId)
     res.status(200).json({
      data: authorData,
      message: 'Author has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
    
   exports.deleteAuthor = async (req, res, next) => {
    try {
     const id = req.params.bookId;
     await Author.findByIdAndDelete(id);
     res.status(200).json({
      data: null,
      message: 'Author has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }
    