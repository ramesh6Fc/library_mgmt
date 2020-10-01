const model = require('../models/userModel');
const Publisher = model.Publisher;
    
    exports.getPublishers = async (req, res, next) => {
    let bookList = await Publisher.find({});
    res.status(200).json({
     data: bookList
    });
   }

   exports.getPublisher = async (req, res, next) => {
    try {
     const publisherId = req.params.publisherId;
     let authorData = await Publisher.findById(publisherId);
     if (!authorData) return next(new Error('Publisher does not exist'));
      res.status(200).json({
      data: authorData
     });
    } catch (authorData) {
     next(error)
    }
   }
    
   exports.createPublisher = async (req, res, next) => {
    try {
        const { email, publisher } = req.body
        const publisherData = new Publisher({ publisher, email });
        await publisherData.save();
        res.status(200).json({
            data: publisherData,
            message: 'Publisher has been created'
           });
       } catch (error) {
        next(error)
       }
    }
    
   exports.updatePublisher = async (req, res, next) => {
    try {
     const update = req.body
     const publisherId = req.params.publisherId;
     await Publisher.findByIdAndUpdate(publisherId, update);
     let publisherData = await Publisher.findById(publisherId)
     res.status(200).json({
      data: publisherData,
      message: 'Publisher has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
    
   exports.deletePublisher = async (req, res, next) => {
    try {
     const id = req.params.publisherId;
     await Publisher.findByIdAndDelete(id);
     res.status(200).json({
      data: null,
      message: 'Publisher has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }