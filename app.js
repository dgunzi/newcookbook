/*!
 * cookbook - app.js
 */
var express = require('express'),
	config = require('./config/config').config,
	routes = require('./routes'),
	app = express(),
	site = require('./config/config').site,
	ejs = require('ejs'),
	path = require('path');

app.configure(function(){
	app.set('views', __dirname + '/views');
	app.use(express.bodyParser());
  	app.use(express.methodOverride());
	//app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'html');
	app.engine('html', ejs.renderFile);
	
	/*app.use(express.session({
    	secret: config.session_secret
  	}));*/
});

var staticDir = path.join(__dirname, 'public');
//定义开发环境
app.configure('development', function(){
  app.use(express.static(staticDir));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//定义生产环境
app.configure('production', function(){
  app.use(express.static(staticDir, {maxAge: config.maxAge}));
  app.use(express.errorHandler());
  app.use('view cache',true);
  
  app.use(express.csrf());

  app.use(function(req, res, next) {
    res.locals.csrf = req.session ? req.session._csrf : '';
    next();
  });
});

//定义locals变量
app.locals({
    config  : config,
    site : site
});


// Routes
routes(app);

app.listen(config.node_port, function(){
  	console.log("Express server listening on port %d in %s mode", config.node_port, app.settings.env);
});