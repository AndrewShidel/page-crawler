var Crawler = require("crawler").Crawler;

function crawl(connection, site) {
	var term = "the";
	var c = new Crawler({
		"maxConnections": 10,
                //called after a page is crawled
                "callback": function(error, result, $) {
                	if ($){
                		console.log(error);
                		console.log("Ran");
                		var regex = new RegExp(term, "i");
                		if(result){
                			var page = result.body; 
                			var res = page.match(regex);
                			if (res && res.length > 0){
                				connection.sendUTF(":::"+result.request.uri.path);
                				console.log(result.body);
                			}
                		}

                		$("a").each(function(index,a) {
                			console.log(a.href);
                			connection.sendUTF(a.href);
                			c.queue(a.href);
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

c.queue(site);

}

exports.crawl = crawl;

