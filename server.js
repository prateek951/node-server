//Require modules

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//Array of Mimetypes (JSON)
var mimeTypes = {
	"html" : "text/html",
	"jpeg" : "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
}

// Create Server
http.createServer(function(request,response){
	var uri = url.parse(request.url).pathname;
	//Returns the current working directory of the process
	var fileName = path.join(process.cwd(),unescape(uri));
	console.log('Loading' + uri);
	var stats;
	try{
		stats = fs.lstatSync(fileName);
	}catch(e){
		response.writeHead(404,{'Content-Type' : 'text/plain'});
		response.write('404 Not found!! \n');
		response.end();
		return;
	}
	//Cehck if file/directory
	if(stats.isFile()){
		var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
		response.writeHead(200,{'Content-Type' : 'text/plain'});
		//Create a filestream

		var fileStream = fs.createReadStream(fileName);
		fileStream.pipe(response);
	}else if(stats.isDirectory()){
		//redirect
		response.writeHead(302,{
			'Location' : 'index.html'
		});
	}else{
		response.writeHead(500,{'Content-Type' : 'text/plain'});
		response.write('500 Internal Error \n');
		response.end();
	}

}).listen(3000);