/**
 * cookbook Schema
 */

var mongoose = require('mongoose');

var cookbook = new mongoose.Schema({
	id:String,
	title: String,
	url: String,
	level: String,
	major: String,
	minor: String,
	seasoning: String,
	steps: String,
	datetime : Date,
	user:String
});

mongoose.model('cookbook',cookbook);