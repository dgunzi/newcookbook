/*!
 * site.js - site index controller.
 * 
 */
var config = require('../config/config').config;
var cookbookCtrl = require('./cookbook');
var EventProxy = require('eventproxy').EventProxy;
var url = require('url');

exports.index = function (req, res, next) {
	var current_page = parseInt(req.query.page, 10) || 1;
	console.log('current_page---'+current_page);
	var pathname = url.parse(req.url).pathname;
	var render = function (cookbooks, pages){
		res.render('index', {
			cookbooks: cookbooks,
			current_page: current_page,
			pages: pages,
			base_url: pathname
		});
	}
	var proxy = new EventProxy();
	proxy.assign('cookbooks', 'pages', render);
	var where = {};
	var limit = config.limit;
	var opt = { skip: (current_page - 1) * limit, limit: limit, sort: [ ['datetime', 'desc'] ]};
	
	cookbookCtrl.get_cookbook_by_query(where, opt, function(err, cookbooks){
		if(err) return next(err);
		
		proxy.trigger('cookbooks', cookbooks);
	});
	
	cookbookCtrl.get_cookbook_counts(where, function(err, cookbooks_count){
		if(err) return next(err);
		var pages = Math.ceil(cookbooks_count / limit);
		proxy.trigger('pages', pages);
	});
	
};