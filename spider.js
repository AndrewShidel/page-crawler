var Crawler = require("crawler").Crawler,
    url = require('url');

function crawl(socket, data) {
    var term = data[1];
    var root = data[2],
        next = true;
    results = [];
    console.log('data::' + data)
    var c = new Crawler({
        "maxConnections": 10,
        "callback": function(error, result, $) {
            if ($) {
                var regex = new RegExp(term, "i");
                if (result) {
                    var page = result.body;
                    var res = page.match(regex);
                    if (res && res.length > 0) {
                        socket.emit('hit', result.request.uri.href);
                    }
                }

                if (next) {
                    $("a").each(function(index, a) {
                        var ref = a.href;
                        if (url.parse(ref).hostname == root) {
                            if (results.indexOf(ref) == -1) {
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

    socket.on('disconnect', function() {
        next = false;
    });
}

exports.crawl = crawl;