var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    post: String,
    comment: [{
            owner: String,
            description: String
        }]
});


mongoose.model('comment', commentSchema, 'comment');