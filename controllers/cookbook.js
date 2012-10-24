/**
 * cookbook.js 文件管理
 */
var models = require('../models');
var cookbook = models.cookbook;
var EventProxy = require('eventproxy').EventProxy;
var crypto = require('crypto');

exports.cookbook_write = function(req, res, next){
	res.render('cookbookwrite', {edit: '0', post: ""});
}

exports.cookbook_admin = function(req, res){
	
	var render = function(cookbooks){
		res.render('article', {cookbooks: cookbooks,edit: '0'});
		return;
	}

	var proxy = new EventProxy();
	proxy.assign('cookbooks', render);
	
	cookbook.find({}).sort({'datetime' : 1}).execFind(function(err, cookbooks){
		if(err){
			res.render('error', {error: '查询记录时出错'});
			return;
		}else{
			proxy.trigger('cookbooks', cookbooks);
		}
	});
	
};

exports.cookbook_edit = function(req, res){
	if ( req.params.type == 'a' ){
		
		var render = function(cookbook){
			res.render('cookbookwrite', {cookbook: cookbook,edit: '1'});
			return;
		}
	
		var proxy = new EventProxy();
		proxy.assign('cookbook', render);
		
		cookbook.findOne({id: req.params.id}, function(err, cookbook){
			if(err){
				res.render('error', {error: '查询记录时出错'});
				return;
			}else{
				if(!cookbook){
					res.render('error', {error: '无此信息或已被删除'});
					return;
				}else{
					proxy.trigger('cookbook', cookbook);
				}
			}
		});
		
	}
	
};

exports.cookbook_view = function(req, res, next) {
	
	var render = function(cookbook){
		res.render('cookbookview', {cookbook: cookbook});
		return;
	}

	var proxy = new EventProxy();
	proxy.assign('cookbook', render);
	
  	cookbook.findOne({url: req.params.post}, function(err, cookbook){
  			if(!cookbook){
				res.render('error', {error: '无此信息或已被删除'});
				return;
			}else{
				proxy.trigger('cookbook', cookbook);
			}
	});
}


exports.cookbook_add = function(req, res){
	var d = new Date();
	var newCookbook  = new cookbook();
	
	newCookbook.title = req.body.title;
	newCookbook.url = req.body.url;
	newCookbook.level = req.body.level;
	newCookbook.major = req.body.major;
	newCookbook.minor = req.body.minor;
	newCookbook.seasoning = req.body.seasoning;
	newCookbook.steps = req.body.steps;
	newCookbook.user = 'admin';
	newCookbook.datetime = d;
	newCookbook.id = crypto.createHash('md5').update(newCookbook.url + newCookbook.datetime).digest("hex");

	newCookbook.save(function(err){
		if (err)
			res.render('error', {error: err});
		else
			res.redirect('/cookbook');
	});
}

exports.cookbook_update = function(req, res){
	if (req.params.id){
		cookbook.findOne({id: req.params.id}, function(err, doc){
			if (!doc)
				res.render('error', {error: '无此信息或已被删除'});
			else {
				var d = new Date();
				doc.title = req.body.title;
				doc.url = req.body.url;
				doc.level = req.body.level;
				doc.major = req.body.major;
				doc.minor = req.body.minor;
				doc.seasoning = req.body.seasoning;
				doc.steps = req.body.steps;
				doc.user = 'admin';
				doc.datetime = d;
				doc.save(function(err){
					if (err)
						res.render('error', {error: err});
					else
						res.redirect('/cookbook');
				});
			}
		});
	}
}

exports.cookbook_del = function(req, res){
	if ( req.params.type == 'a')
	{
		if ( req.params.id != "" ){
			cookbook.remove({id: req.params.id}, function(err){
				if (err) 
					res.render('error', {error: err});
				else 
					res.redirect('/cookbook');
			});
		}
	}
};

//指明查询条件查询多条记录
function get_cookbook_by_query(where, opt, cb){
	var query = cookbook.find(where).limit(opt.limit).skip(opt.skip).sort({ datetime: 'desc'});;
	query.exec(function(err, docs){
		if(err) return cb(err, null);
		if(docs.length == 0) return cb(err, []);
		return cb(err, docs);
	});
}

//记录总数
function get_cookbook_counts(where, cb){
	cookbook.count(where, function(err, count){
		if(err) return cb(err);
		return cb(err, count);
	});
}


exports.get_cookbook_by_query = get_cookbook_by_query;
exports.get_cookbook_counts = get_cookbook_counts;
