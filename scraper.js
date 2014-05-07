var request = require('request');
var	cheerio = require('cheerio');

//I wrote this scraper as a seperate module because... just because, ok?
//I could come up with an articulate justification, but we both know 
//that it feels right.
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
					callback(a);	
		        }    
		});
  }
};