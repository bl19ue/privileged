var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    name : String,
    owner : String,
    problem : String,
    solution_text: String,
    solution_media : [String],
    members : [String],
    technologies : [String]
});


mongoose.model('user', userSchema, 'user');