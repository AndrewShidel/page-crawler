var express = require('express'),
    spider = require("./spider"),
    app = express(),
    request = require('request'),
    http = require("http"),
    fs = require('fs'),
    url = require('url');




app.listen(3000);
console.log('Listening on port 3000');

app.use(express.static(__dirname + '/static'));

app.get('*', function(req, res) {
    //console.log("Param: " + req.params[0].substring(1));
    console.log(req.params[0].substring(10));
    getSource(req.params[0].substring(10), res);
});


function getSource(uri, res) {

    var d = new Date();
    var n = d.getTime();
    n = n + '.html'

    request(uri, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var r = /src\s*=\s*"([^"]*)"/g;
            var matches = body.match(r);
            
            for (var match in matches) {
               console.log(matches[match])
            }

            fs.writeFile("temp/" + n, body, function(err) {
                if (err) throw err;
                res.download('./temp/' + n, "page.html");
                setTimeout(function() {
                    fs.unlink("./temp/" + n)
                }, 1000);
            });
        };
    });
}

var io = require('socket.io').listen(1234);

io.sockets.on('connection', function(socket) {

    socket.on('submit', function(data) {
        spider.crawl(socket, data);
    });

});

//exports.start = start;