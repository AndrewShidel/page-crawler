var Crawler = require("crawler").Crawler,
    AdmZip = require('adm-zip'),
    fs = require("fs"),
    zip = new AdmZip(),
    files = [];

function crawl(response, site) {
    fs.mkdir("./ding/",function(err){
        console.log(err);
    });
    var c = new Crawler({
        "maxConnections": 10,
        //called after a page is crawled
        "callback": function(error, result, $) {
            console.log(result["request"]["uri"]);
            //console.log("PathName: "+result.uri.pathname);
            if (result) {
                var page = result.body,
                    res = page.match(/(src|href)\s*=\s*"([^"]*)"/g);
                for (var i = 0; i < res.length; i++) {
                    res[i] = res[i].match(/"(.+)"$/)
                }

                if (res && res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        //files.push(res[i][1]);

                    }

                    //fs.writeFile("","")
                    zip.addLocalFolder("d/");
                   

                    //zip.writeZip( /*target file name*/ "files.zip");
                    filename = "testfile.zip"
                    fs.writeFile(filename, zip.toBuffer(), function(err) {
                        if (err) throw err;
                        console.log('It\'s saved!');
                        response.download(__dirname + '/testfile.zip', "testfile.zip");
                        //response.write("<a href='/d/"+filename+">Click here to download your file.</a>")
                        //response.end();
                    });

                }
            }
        }
    });


    // Queue just one URL, with default callback
    c.queue(site);
}

exports.crawl = crawl;