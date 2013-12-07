var express = require('express'),
    http = require('http'),
    url = require("url"),
    app = express(),
    server = http.createServer(app),
    spider = require("./spider"),
    site;



function start(){

app.get('/', function(request, response) {
    response.sendfile(__dirname + '/index.html');
});


app.get("*", function(request, response) {
    var p_url;
    if (request != 'localhost:3000') {
        p_url = (url.parse(request.url).pathname).replace(/^\//, '');
        if (p_url.indexOf('http://') != 0) {
            site = 'http://' + p_url;
        } else {
            site = (url.parse(request.url).pathname)
        }
        spider.crawl(response, site)
    }

});
app.listen(3000);
}

exports.start = start;
