const mongoose = require('mongoose');
const Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
 
const UserSchema = new Schema({
    id: ObjectId,
    email: {
    type: String,
    required: true,
    trim: true
    },
    fName: {
    type: String,
    required: true
    },
    lName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
        },
    books:{
        type: Array
    },
    role: {
    type: String,
    default: 'user',
    enum: ["user", "admin"]
    },
    accessToken: {
    type: String
    }
});
 
const BooksSchema = new Schema({
    id: ObjectId,
    book: {
     type: String,
     required: true,
     trim: true
    },
    author: {
     type: String
    },
    publisher: {
     type: String
    },
    bookCategory:{
    type: String
    },
    isLended: {
        type: Boolean,
        default: false
    }
   });

   const AuthorSchema = new Schema({
    id: ObjectId,
    author: {
     type: String,
     required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
       }
   });

   const PublisherSchema = new Schema({
    id: ObjectId,
    publisher: {
     type: String,
     required: true
    },
    email: {
        type: String,
        required: true,
        trim: true
       }
   });
const UserCol = mongoose.model('user', UserSchema);
const AuthorCol = mongoose.model('author', AuthorSchema);
const BookCol = mongoose.model('book', BooksSchema);
const PublisherCol = mongoose.model('publisher', PublisherSchema);
 
module.exports =  {
    User: UserCol,
    Author: AuthorCol,
    Book: BookCol,
    Publisher: PublisherCol
};