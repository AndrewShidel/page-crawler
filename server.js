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

app.get('download/', function(req, res) {
    console.log(req.params[0].substring(1));
    getSource(req.params[0].substring(1), res);
});


function getSource(uri, res) {

    var d = new Date();
    var n = d.getTime()
    n = n + '.html'

    request(uri, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //res.send(body)
            fs.writeFile("temp/" + n, body, function(err) {
                if (err) throw err;
                res.download('./temp/' + n, "page.html");
            });
        }
    });
}

io = require('socket.io').listen(1234);

io.sockets.on('connection', function(socket) {

    socket.on('submit', function(data) {
        spider.crawl(socket, data);
    });

});

//exports.start = start;