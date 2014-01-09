get_source = function(data){
console.log('ok:'+data)
var http = require('http');
var options = {
  host: 'www.google.com',
  path: '/index.html'
};

var req = http.get(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));

  // Buffer the body entirely for processing as a whole.
  var bodyChunks = [];
  res.on('data', function(chunk) {
    // You can process streamed parts here...
    bodyChunks.push(chunk);
  }).on('end', function() {
    var body = Buffer.concat(bodyChunks);
    console.log('BODY: ' + body);
    // ...and/or process the entire body here.
  })
});

req.on('error', function(e) {
  console.log('ERROR: ' + e.message);
});

}

exports.get_source = get_source;








// var express = require('express');
// var app = express();
// var request = require('request');
// var http = require("http");
// var fs = require('fs');
// var url = require('url');

// app.get('*', function(req, res){
// 	console.log(req.params[0].substring(1));
// 	getSource(req.params[0].substring(1), res);
// });

// app.listen(3000);
// console.log('Listening on port 3000');



// function getSource(uri, res){

// 	var d = new Date();
// 	var n = d.getTime()
// 	n = n + '.html'

// 	request(uri, function (error, response, body) {
// 		if (!error && response.statusCode == 200) {
// 	    	//res.send(body)
// 	    	fs.writeFile("temp/"+n, body, function (err) {
//   				if (err) throw err;
//   				res.download('./temp/'+n, "page.html");
// 			});
// 		}
// 	});
// }