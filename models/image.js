/**
 * cookbook Schema
 */
var mongoose = require('mongoose');
	
var image = new mongoose.Schema({
	sname:String,
	oname: String,
	user:String,
	flag:String
});

exports.imgModel = mongoose.model('image', image);