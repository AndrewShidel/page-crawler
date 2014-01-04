var Crawler = require("crawler").Crawler,
    url = require('url');

function crawl(socket, data) {
    var term = data[1];
    var root = data[2]
    console.log('data::'+data)
    var c = new Crawler({
        "maxConnections": 10,
        //called after a page is crawled
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

                $("a").each(function(index, a) {
                    if (url.parse(a.href).hostname == root){
                        c.queue(a.href);
                    }
                });

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
        }

    });

    c.queue(data[0]);

}

exports.crawl = crawl;