var express = require('express');
var app = express();
var request = require('request');
var http = require("http");
var fs = require('fs');
var url = require('url');

app.get('*', function(req, res){
	console.log(req.params[0].substring(1));
	getSource(req.params[0].substring(1), res);
});

app.listen(3000);
console.log('Listening on port 3000');



function getSource(uri, res){

	var d = new Date();
	var n = d.getTime()
	n = n + '.html'

	request(uri, function (error, response, body) {
		if (!error && response.statusCode == 200) {
	    	//res.send(body)
	    	fs.writeFile("temp/"+n, body, function (err) {
  				if (err) throw err;
  				res.download('./temp/'+n, "page.html");
			});
		}
	});
}