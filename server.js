var express = require('express'),
    http = require('http'),
    url = require("url"),
    server = http.createServer(function(request, response) {}),
    spider = require("./spider"),
    site;

server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(r){
    // Code here to run on connection
    var connection = r.accept('echo-protocol', r.origin);

    // Create event listener
    connection.on('message', function(message) {

        spider.crawl(connection, message.utf8Data);

    })

});

//exports.start = start;
