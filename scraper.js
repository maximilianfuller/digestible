var request = require('request');
var	cheerio = require('cheerio');

module.exports = {
  scrapeUrl: function (url, callback) {
  		//the following code grabs all paragraphs and headings from the given url
		request(url, function(err, resp, body) {
				//console.log("fff");

		        if (err)
		            throw err;
		        $ = cheerio.load(body);
		        //console.log($('#site-info').val());

		        var a = "";
		        $('body').find('p').each(function(){
		        	a = a + $(this).html();
		        	//console.log($(this).text());
		        });
		        console.log("got here");
		        //console.log(a);
				callback(a);
		});
  }
};
/*function getDOMFromHtml(var, html) {
	//return a DOM object
}

function getContent(var, dom) {
	//return some string
}

function getTitle(var, dom) {
	//return some string
}

function getAuthor(var, dom) {
	//return some string
}

function getDate(var, dom) {
	//return some string
}
*/