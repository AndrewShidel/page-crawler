var Crawler = require("crawler").Crawler;

function crawl(response, site) {

     var c = new Crawler({
         "maxConnections": 10,
         //called after a page is crawled
         "callback": function(error, result, $) {

             if (result) {
                 var page = result.body;
                 var res = page.match(/ /);
                 if (res && res.length > 0) {
                     response.writeHead(200, {
                         "Content-Type": "text/plain"
                     });
                     response.write(page);
                     response.end();

                 }
             }

             // $ is a jQuery instance scoped to the server-side DOM of the page
             /* $("a").each(function(index,a) {
        console.log(a.href);
        c.queue(a.href);
    });*/
         }
     });

     // Queue just one URL, with default callback
     c.queue(site);
 }

 exports.crawl = crawl;