var mongoose = require('mongoose');

var githubSchema = new mongoose.Schema({
    languages: {},
    lines_of_code: String,
    commits: String,
    reponame: String,
    owner: String,
    contributors: [{commits: Number, name: String}]
});


mongoose.model('githubstats', githubSchema, 'githubstats');