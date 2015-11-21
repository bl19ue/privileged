var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    problem : String,
    name: String,
    owner: String,
    solution_text: String,
    solution_media: [String],
    members: [String],
    technologies: [String],
    github_url: String
});


mongoose.model('team', teamSchema, 'team');