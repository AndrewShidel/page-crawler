var Crawler = require("crawler").Crawler,
    AdmZip = require('adm-zip'),
    fs = require("fs"),
    zip = new AdmZip(),
    files = [],
    first = true,
    count = 0;

function crawl(response, site) {
    fs.mkdir(site, function() {
        fs.mkdir(site + '/resources', function() {
            var c = new Crawler({
                "maxConnections": 10,
                //called after a page is crawled
                "callback": function(error, result, $) {
                    
                    if (result) {
                        var page = result.body,
                            res = page.match(/(src|href)\s*=\s*"([^"]*)"/g);
                        for (var i = 0; i < res.length; i++) {
                            res[i] = res[i].match(/"(.+)"$/)[0]
                        }

                        if (res && res.length > 0) {
                            for (var i = 0; i < res.length; i++) {
                                //files.push(res[i][1]);
                                if (res[i].search("http") != -1)
                                    c.queue(res[i]);
                                else
                                    c.queue(result.request.uri.protocal + result.request.uri.host + res[i]);
                            }

                            var filename;

                            if (count == 0) {
                                filename = site+"/index.html";
                            } else {
                                filename = site+"/resources/"+count + '.' + result.request.uri.path.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)[1];
                            }
                            count += 1;

                            //fs.writeFile("","")
                            //zip.addLocalFolder("d/");
                            zip.addFile(filename, new Buffer(page), "Something");

                            zip.writeZip( /*target file name*/ "test.zip");

                            response.download(__dirname + '/test.zip', "test.zip");

                        }
                    }
                }
            });


            // Queue just one URL, with default callback
            c.queue(site);
        })

    })
}

exports.crawl = crawl;