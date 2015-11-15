var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    first_name : String,
    last_name : String,
    email : String,
    password : String,
    token : String,
    problems_owned : [String],
    problems_working : [String],
    teams_owned : [String],
    teams_working : [String],
    interests : [String],
    expertise : [{technology: String}, {score: Number}]
});


mongoose.model('user', userSchema, 'user');