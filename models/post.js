var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({
    problem: String,
    owner : String,
    description: String,
    upvotes: Number,
    comments: String
});


mongoose.model('post', postSchema, 'post');