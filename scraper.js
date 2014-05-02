var request = require('request');
var	cheerio = require('cheerio');

module.exports = {
  scrapeUrl: function (url, callback) {
  		//the following code grabs all paragraphs and headings from the given url
		request(url, function(err, resp, body) {
		        if (err){
		        	callback("invalid url");
		        }
		        else{
			        $ = cheerio.load(body);

			        var a = "";
			        $('body').find('p').each(function(){
			        	a = a + "<p>" + $(this).html() + "</p>";
			        });
			        console.log("fff");
					callback(a);	
		        }    
		});
  }
};