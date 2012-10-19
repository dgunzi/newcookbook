/**
 * upload controller
 */
// Mainfunction to recieve and process the file upload data asynchronously
var models = require('../models');
var imageModel = models.image;
var uuid = require('node-uuid');
var fs = require('fs');
var image = require('../models/image');
var imageModel = image.imgModel;

	// Mainfunction to recieve and process the file upload data asynchronously
	exports.uploadFile = function(req, targetdir,tmpdri,callback) {
	
	    // Moves the uploaded file from temp directory to it's destination
	    // and calls the callback with the JSON-data that could be returned.
	    var moveToDestination = function(sourcefile, targetfile, sname) {
	        moveFile(sourcefile, targetfile, function(err) {
	            if(!err){
					saveFile(req,sname,function(err){
						if(!err){
							callback({success: true,filename: sname});
						}else{
							 callback({success: false, error: err});
						}
					});
					callback({success: true,filename: sname});
	            }else{
	                callback({success: false, error: err});
				}	
	        });
	    };
	
	    // Direct async xhr stream data upload, yeah baby.
	    if(req.xhr) {
	        var fname = req.header('x-file-name');
			var ex = fname.substring(fname.indexOf('.'));
	        // Be sure you can write to '/tmp/'
			var id = uuid.v1();
	        var tmpfile = tmpdri + id;
			var saveName = id+ex;
	
	        // Open a temporary writestream
	        var ws = fs.createWriteStream(tmpfile);
	        ws.on('error', function(err) {
	            console.log("uploadFile() - req.xhr - could not open writestream.");
	            callback({success: false, error: "Sorry, could not open writestream."});
	        });
	        ws.on('close', function(err) {
	            moveToDestination(tmpfile, targetdir+saveName,saveName);
	        });
	
	        // Writing filedata into writestream
	        req.on('data', function(data) {
	            ws.write(data);
	        });
			
	        req.on('end', function() {
	            ws.end();
	        });
		}	
	    // Old form-based upload
	    else {
	        moveToDestination(req.files.qqfile.path, targetdir+req.files.qqfile.name,req.files.qqfile.name);
	    }
	};

	var saveFile = function(req,sname,callback){
		var image = new imageModel();
		var oname = req.header('x-file-name');
		var user = 'admin';
		
		image.sname = sname;
		image.oname = oname;
		image.user = user;
		image.flag = '0';
		
		image.save(function(err){
			if (err)
				callback('Sorry, can not save file to datebase');	
			else
				callback();
		});
	};

	// Moves a file asynchronously over partition borders
	var moveFile = function(source, dest, callback) {
	    var is = fs.createReadStream(source)
	
	    is.on('error', function(err) {
	        console.log('moveFile() - Could not open readstream.');
	        callback('Sorry, could not open readstream.')
	    });
	    is.on('end', function() {
	        fs.unlinkSync(source);
	        callback();
	    });
	    
	    var os = fs.createWriteStream(dest);
	    os.on('error', function(err) {
	        console.log('moveFile() - Could not open writestream.');
	        callback('Sorry, could not open writestream.');
	    });
	    
	    is.pipe(os);
	};