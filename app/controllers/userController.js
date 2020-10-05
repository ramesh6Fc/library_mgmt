
const bookController = require('./bookController');
const model = require('../models/userModel');
const User = model.User;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
 
async function hashPassword(password) {
 return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
 return await bcrypt.compare(plainPassword, hashedPassword);
}
 
exports.signup = async (req, res, next) => {
    
 try {
  const { email, password, role, fName, lName } = req.body
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ fName: fName, lName: lName, email, password: hashedPassword, role: role || "basic" });
  const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
   expiresIn: "1d"
  });
  newUser.accessToken = accessToken;
  await newUser.save();
  res.json({
   data: newUser,
   accessToken
  })
 } catch (error) {
  next(error)
 }
}


exports.login = async (req, res, next) => {
    try {
     const { email, password } = req.body;
     const user = await User.findOne({ email });
     if (!user) return next(new Error('Email does not exist'));
     const validPassword = await validatePassword(password, user.password);
     if (!validPassword) return next(new Error('Password is not correct'))
     const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
     });
     await User.findByIdAndUpdate(user._id, { accessToken })
     res.status(200).json({
      data: { email: user.email, role: user.role },
      accessToken
     })
    } catch (error) {
     next(error);
    }
   }


   exports.getUsers = async (req, res, next) => {
    const users = await User.find({});
    res.status(200).json({
     data: users
    });
   }
    
   exports.getUser = async (req, res, next) => {
    try {
     const userId = req.params.userId || req.user._id;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: user
     });
    } catch (error) {
     next(error)
    }
   }

     
   exports.getMybooks = async (req, res, next) => {
    try {
     const userId = req.params.userId || req.user._id;
     const user = await User.findById(userId);
     if (!user) return next(new Error('User does not exist'));
      res.status(200).json({
      data: books
     });
    } catch (error) {
     next(error)
    }
   }
    
   exports.updateUser = async (req, res, next) => {
    try {
     const update = req.body
     const userId = req.params.userId;
     req.body.password ? update.password = await hashPassword(req.body.password ) : null;
     await User.findByIdAndUpdate(userId, update);
     const user = await User.findById(userId)
     res.status(200).json({
      data: user,
      message: 'User has been updated'
     });
    } catch (error) {
     next(error)
    }
   }
   
   exports.updateUserLend = async (req, res, next) => {
    try {
     const update = {$push: {books: {book: req.body.book, author:  req.body.author || null, publisher:  req.body.publisher || null, }}};req.body
     const userId = req.params.userId || req.user._id;
     var isLend = await bookController.CheckBookNotLend(req)
     if(isLend.length > 0){

      await User.findByIdAndUpdate(userId, update);
      req.params.bookId = isLend[0]._id;
      req.body = {isLended:true};
      const bookUpdate = await bookController.updateBook(req, res);
      return res;
     
    }else{
      res.status(200).json({
        data: null,
        message: 'The Book Not Available'
       });
     }
    } catch (error) {
     next(error)
    }
   }
    
   exports.deleteUser = async (req, res, next) => {
    try {
     const userId = req.params.userId;
     await User.findByIdAndDelete(userId);
     res.status(200).json({
      data: null,
      message: 'User has been deleted'
     });
    } catch (error) {
     next(error)
    }
   }
    

const { roles } = require('../roles')
 
exports.grantAccess = function(action, resource) {
 return async (req, res, next) => {
  try {
   const permission = roles.can(req.user.role)[action](resource);
   if (!permission.granted) {
    return res.status(401).json({
     error: "You don't have enough permission to perform this action"
    });
   }
   next()
  } catch (error) {
   next(error)
  }
 }
}
 
exports.allowIfLoggedin = async (req, res, next) => {
 try {
  const user = res.locals.loggedInUser;
  if (!user)
   return res.status(401).json({
    error: "You need to be logged in to access this route"
   });
   req.user = user;
   next();
  } catch (error) {
   next(error);
  }
}