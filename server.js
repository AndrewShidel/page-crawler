var express = require('express'),
    http = require('http'),
    url = require("url"),
    server = http.createServer(function(request, response) {}),
    spider = require("./spider"),
    site,
    io = require('socket.io').listen(1234);

io.sockets.on('connection', function (socket) {
   
    socket.on('submit', function (data) {
    spider.crawl(socket, data); 
  });
});





//exports.start = start;
