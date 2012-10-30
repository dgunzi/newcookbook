/*
 * user.js 用户编辑和添加
 * 
 * */

var config = require('../config/config').config;
var crypto = require('crypto');
var models = require('../models');
var User = models.User;
var check = require('validator').check,
    sanitize = require('validator').sanitize;


//设置缓存函数
function gen_session(user, res, req){
    var auth_token = encrypt(user._id + '\t' + user.user_name + '\t' + user.password + '\t' + user.email, config.session_secret);
    res.cookie(config.auth_cookie_name, auth_token, {path: '/',maxAge: 1000 * 60 * 60}); //cookie 有效期１个小时
    req.session.user = user;
    req.session.cookie.maxAge = 1000 * 60 * 60;
}

//对称加密函数
function encrypt(str, secret){
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str, secret){
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function md5(str) {
  var md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
}

//add view
exports.add_html = function(req, res, next){
    res.render('user_add');
};

//add user action
exports.add_action = function(req, res, next){
    var user_name = sanitize(req.body.user_name).trim();
    user_name = sanitize(user_name).xss();
    var password = sanitize(req.body.password).trim();
    password = sanitize(password).xss();
    var email = sanitize(req.body.email).trim();
    email = sanitize(email).xss();
    if(user_name == '' || email == '' || password == ''){
    	res.render('user_add', {error: '信息不能为空', user_name: user_name, email: email});
    	return;
    }
    //验证用户名
    try{
    	check(user_name, '用户名只能使用字母和数字').isAlphanumeric();
    }catch(e){
    	res.render('user_add',{error: e.message, user_name: user_name, email: email});
    	return;
    }
    //验证电子邮箱
    try{
    	check(email, '不正确的电子邮箱').isEmail();
    }catch(e){
    	res.render('user_add',{error: e.message, user_name: user_name, email: email});
    	return;
    }
    
    User.find({'$or':[{'user_name': user_name},{'email': email}]}, function(err, userRow){
		if(err){
		    return next(err);
		}
		if(userRow.length > 0){
		    res.render('user_add', {error: '用户名或邮箱已被使用,请重新输入',user_name: user_name,email: email});
		    return;
		}
		
		password = md5(password);
		user = new User();
		user.user_name = user_name;
		user.password = password;
		user.email = email;
		user.create_time = Date.now();
		
		user.save(function(err){
			if(err) return next(err);
			
			User.findOne({'user_name': user_name}, function(err, userRow){
				if(err) return next(err);
				
				if(userRow){
					gen_session(userRow, res, req);
					
					res.redirect('/');
				}else{
					res.render('login',{error: '没有此用户，或已被删除'});
	    			return;
				}
			});
		});
    });

}