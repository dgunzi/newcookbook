/**
 * New node file
 */
var mongoose = require('mongoose');
var config = require('../config/config').config;

mongoose.connect(config.db, function(err){
    if(err){
	console.log('Connect Is Error: ', config.db, err.message);
		process.exit(1);
    }
});

//models
require('./cookbook');
require('./user');

exports.cookbook = mongoose.model('cookbook');
exports.User = mongoose.model('User');
