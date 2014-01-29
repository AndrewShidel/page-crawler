var express = require('express'),
    spider = require("./spider"),
    app = express(),
    request = require('request'),
    http = require("http"),
    fs = require('fs'),
    url = require('url');

//Initialize variables for zippping files.
var zip = new require('node-zip')();
var toAdd = [];


app.listen(3000);
console.log('Listening on port 3000');



app.use(express.static(__dirname + '/static'));

app.get('*', function(req, res) {
    getSource(req.params[0].substring(10), res, true, 0, function(){});
});

//This is a recursive fuction that downloas a page with all of its resources and saves them to a .zip file.
//
//Params:
//  uri:        The url to download.
//  res:        Express object to send a response to the client
//  first:      First is true if this call to the function is not recursive
//  count:      The number of times that this function has been called.
//  callback:   Used to signify to the caller that the item as finished downloading
//
function getSource(uri, res, first, count, callback) {
    //Setup a filename for the temporary file.
    var d = new Date();
    var n = d.getTime();
    n = n + '.zip'

    //Get the source of the url.
    request(uri, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            //If this is not the top level in recursion, then add the contents to the zip
            if (!first){   
                //Add the file contents and the filename to an array that will later be added to the .zip
                toAdd.push(body);
                toAdd.push(count + uri.substring(uri.lastIndexOf(".")));
                //fs.writeFileSync('temp/'+d.getTime()+".jpg", body, 'binary');
                //Call callback to signify the end of this iteration
                callback();                
            }

            //If we are preccessing the index file.
            if (first){

                //Get all src tags.
                var r = /(src)\s*=\s*("|')([^"]*)("|')/g;
                var matches = body.match(r);

                //Get an instence of the current uri.
                var ruri = response.request.uri;

                var timesCalled = 0;
                var timesToCall = matches.length;

                //Loop through each result.
                for (var i = 0; i < matches.length; i++) {
                   
                   //Get what is in between the quotes.
                   //var inner = matches[i].substring(matches[i].toLowerCase().indexOf("=")+2, matches[i].length-1);
                   var inner = matches[i].match(/([""'])(?:(?=(\\?))\2.)*?\1/)[0];
                   inner = inner.substring(1, inner.length-1);

                   //Replace the file name in the page with the local version
                   body.replace(inner, count+1 + "." + inner.substring(inner.lastIndexOf(".")));
                   
                   //Turn any relative paths into absolute paths.
                   if (inner.indexOf("http") == -1){
                        inner = ruri.protocol + "//" + ruri.host + (ruri.path[0]!="/"?ruri.path.substring(1):ruri.path) + (inner[0]=="/"?inner.substring(1):inner) 
                   }

                   //request(inner).pipe(fs.createWriteStream("./temp/"+(new Date()).getTime()+".jpg"))
                   
                   //recursive call to get page's resources.
                   getSource(inner, null, false, count++, function(){
                        timesCalled++;
                        //When we have recieved a response from every resource, create the zip file and initiate the download.
                        if (timesCalled == timesToCall) finalize(res, body, n);
                   });              
                }
            }
        }else{
            callback();
        }
    });
}

//Converts an relative path into an absolute path.
function absolute(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); 
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
}

//This function is called once from getSource to create a .zp file and initiate a download.
function finalize(res, body, n){
    zip.file("index.html", body);    
    for (var i = 0; i < toAdd.length; i+=2){
        zip.file(toAdd[i+1], toAdd[i], {base64: true});
    }
    var data = zip.generate({base64:false,compression:'DEFLATE'});
    fs.writeFileSync('temp/'+n, data, 'binary');
    res.download('./temp/' + n, "page.zip");
    setTimeout(function() {
        //fs.unlink("./temp/" + n)
    }, 1000);
}



var io = require('socket.io').listen(1234);

io.sockets.on('connection', function(socket) {

    socket.on('submit', function(data) {
        spider.crawl(socket, data);
    });

});