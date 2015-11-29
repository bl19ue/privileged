var mongoose = require('mongoose');

var problemSchema = new mongoose.Schema({
    owner : String,
    title : String,
    description : String,
    tools : [String],
    technologies : [String],
    problem_media : [String],
    github_url: String,
    my_solution : String,
    date: String,
    upvotes: {type: Number, default: 0},
    people: [String],
    teams: [String]
});


mongoose.model('problem', problemSchema, 'problem');