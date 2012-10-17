/**
 * cookbook.js 文件管理
 */
var models = require('../models');
var cookbook = models.cookbook;
var EventProxy = require('eventproxy').EventProxy;


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

//指明查询条件查询多条记录
function get_cookbook_by_query(where, opt, cb){
	//console.log(opt)
	cookbook.find(where,function(err, docs){
		if(err) return cb(err, null);
		//console.log('docs--'+docs);
		if(docs.length == 0) return cb(err, []);
		return cb(err, docs);
	}).skip(opt.skip).limit(opt.limit);
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
