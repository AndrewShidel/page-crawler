var Crawler = require("crawler").Crawler,
    url = require('url'),
    download = require("./download");

function crawl(socket, data) {
    var term = new RegExp(data[1], "i"),
        root = data[2],
        next = true,
        results = [];
    console.log('data::' + data)
    var c = new Crawler({
        "maxConnections": 10,
        "callback": function(error, result, $) {
            if ($) {
                if (result) {
                    var page = result.body;
                    var res = page.match(term);
                    if (res && res.length > 0) {
                        socket.emit('hit', result.request.uri.href);
                    }
                }

                if (next) {
                    $("a").each(function(index, a) {
                        var ref = a.href;
                        if (url.parse(ref).hostname == root) {
                            console.log(results.indexOf(ref) == -1);

                            if (!contains(results, ref)) {

                                c.queue(ref);
                                results.push(ref);
                            
                            }
                        }
                    });
                }
            }

            /*
                    if (result) {
                        var page = result.body,
                        temp = page.match(/(src|href)\s*=\s*"([^"]*)"/g);

                        for (var i = 0; i < temp.length; i++) {

                            var match = temp[i].match(/"(.+)"$/)
                            if (match){
                                res[res.length] = match[1];
                            }



                    }
                }*/



        }

    });

    c.queue(data[0]);
    results.push(data[0])
    console.log('this')
    socket.on('disconnect', function() {
        next = false;
    });

    socket.on('download', function(data){download.get_source(data)})
}


function contains(arr, key){
    for (var i = 0; i < arr.length; i++){
        if (arr[i] == key) return true;
    }
    return false;
}


exports.crawl = crawl;