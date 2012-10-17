/**
 * config
 */
var mongoose = require('mongoose');

//config
exports.config = {
	session_secret: 'cookbook',
	maxAge        : 6000,
	limit         :　5,
	username      : "admin",
	password      : "admin",
	node_port     : process.argv[2] || 3000,
	upload_dir    :　__dirname + '/public/uploads/',
	db 			  : 'mongodb://127.0.0.1:27017/nodeblog'
}

//siteinfo
exports.site = {
	title: 'Homely Dishes',
	subtitle: '做些家常菜吧，把它分享给你爱的人',
	domain: 'http://www.jiachangcai.com' ,
	keywords: '家常菜，菜谱，做菜，做饭，私房菜，美食,美食网，菜谱，菜谱网，美食地图，食谱，食谱网，特色食谱，特色美食，美食大全家常菜谱，菜谱大全，美食网站，特色菜谱，最新菜谱，美食分享，美食加盟，人气美食，菜谱分享，餐饮加盟，特色小吃，美食文化',
	description: 'Homely Dishes，国内第一个兼容所有平台的美食，食谱，菜谱网。做你最喜爱的美食网，菜谱网。提供最人性化的菜谱大全,食谱家常菜，家常菜谱大全的美食网,让您为自己爱的人做一份美食，来吧！享受美食的乐趣.找家常菜谱。',
	copyright: 'Copyright &copy;2011 - 2012 Homely Dishes版权所有 ',
	version: '0.1',
};