/*!
 * cookbook - route.js
 * 
 */

var site = require('./controllers/site');
var cookbook = require('./controllers/cookbook');
var upload = require('./controllers/upload');
var config = require('./config/config').config;

module.exports = function (app) {
  // home page
  app.get('/', site.index);
  //admin cookbook
  app.get('/cookbook', cookbook.cookbook_admin);
  //edit cookbook
  app.get('/edit/:type/:id', cookbook.cookbook_edit);
  // write
  app.get('/write', cookbook.cookbook_write);
  

  // Route that takes the post upload request and sends the server response
  app.post('/upload', function(req, res) {
		var uploadPath = __dirname + config.upload_dir;
		var tempPath = __dirname + config.tmp_dir;
	    upload.uploadFile(req, uploadPath,tempPath,function(data) {
	        if(data.success)
	            res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 200);
	        else
	            res.send(JSON.stringify(data), {'Content-Type': 'text/plain'}, 404);
	    });
  });	
	
  //view
  app.get('/:post', cookbook.cookbook_view);

};  