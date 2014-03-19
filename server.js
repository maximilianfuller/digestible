//digestable node.js based server

//dependencies
var http = require('http');
var	colors = require('colors');
var	express = require('express');
var engines = require('consolidate');
var anyDB = require('any-db');
var mailer = require('nodemailer');
var conn = anyDB.createConnection('sqlite3://digestible.db');
var app = express();

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));

// create reusable transport method (opens pool of SMTP connections)
//NOTE: we may want to use a different transport method
var smtpTransport = mailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "benjamin_resnick@brown.edu",
        pass: "cindy301" //now don't go doin mischevious things with my password y'all
    }
});


//data structure initializations 
scheduled_jobs = []; 


/* ////////////////////////////////////////////
End of initialization
*//////////////////////////////////////////////

/* ////////////////////////////////////////////
timed email testing
*//////////////////////////////////////////////

/*
how to create a date five days in the future:
var myDate=new Date();
myDate.setDate(myDate.getDate()+5);
*/


function scheduleEmail(senderName, senderEmail, receiver, eSubject, body, dateToEmail){
	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: senderName + " <" + senderEmail + ">", // sender address
	    to: receiver, // list of receivers
	    subject: eSubject, // Subject line
	    text: body // plaintext body

	    //remember to add comma if using html field
	    //html: "<b>Hello world</b>" // html bodies can also be sent
	};

	//sendEmail(mailOptions);'
	

	//calculate milliseconds until send
	millis = dateToEmail.getTime()-((new Date()).getTime());
	j = setTimeout(function(){console.log('yup')},millis);
	console.log(millis);
	console.log(dateToEmail.getTime());
	console.log((new Date()));
}

function sendEmail(email){
	// send mail with defined transport object
	smtpTransport.sendMail(email, function(error, response){
	    if(error){
	        console.log(error);
	    }else{
	        console.log("Message sent: " + response.message.cyan);
	    }

	    // if you don't want to use this transport object anymore, uncomment following line
	    //smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

senderName = "Fred Foo";
senderEmail = "benjamin_resnick@brown.edu";
receiver = "benjamin_resnick@brown.edu, neb301@yahoo.com";
subject = "Hello";
body = "Hello world";
var dateToEmail = new Date(2014, 3, 19, 14, 26 ,0,0); //year, month, day, hour, minute, second, millis
scheduleEmail(senderName,senderEmail,receiver,subject,body,dateToEmail);


/* ////////////////////////////////////////////
end email testing
*//////////////////////////////////////////////

/* ////////////////////////////////////////////
ajax/server input handling
*//////////////////////////////////////////////

//server communications comes in here-
//is this the way we wanna do things?
app.post('*', function(request, response){

});

/* ////////////////////////////////////////////
Methods that get called on our server
*//////////////////////////////////////////////

//generates an entry
function makeNewEntry(entry, collection_id){
    conn.query('INSERT INTO Entries (entry_id, collection_id, collection_title, ' + 
        'creator_email, author, title, date_submitted, content)' + 
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', 
        [
            entry.entry_id, 
            entry.collection_id, 
            entry.collection_title,
            entry.creator_email,
            entry.author,
            entry.title,
            entry.date_submitted,
            entry.content
        ])
        .on('error', console.error);
}

//editEntry
function editEntry(entry, entryID){
    unique_id = generateMessageIdentifier();
}

//deletes an entry
function deleteEntry(entryID){
    conn.query('DELETE FROM Entries WHERE entry-id=$1', [entryID])
        .on('error', console.error);
}



//creates a subscription
function subscribeToEmail(EntryId,whatotherparamtersdoweneed){

}

//unsubscribes
function unsubscribe(email,entryID){

}


/* ////////////////////////////////////////////
Internal server functionality
*//////////////////////////////////////////////


//what is this function for?
function Entry(entry_id, collection_id, collection_title, 
    creator_email, author, title, date_submitted, content) {
    this.entry_id = entry_id;
    this.collection_id = collection_id;
    this.collection_title = collection_title;
    this.creator_email = creator_email;
    this.author = author;
    this.title = title;
    this.date_submitted = date_submitted;
    this.content = content;
}

//generate a message identifier
function generateMessageIdentifier() {
    // make a list of legal characters
    // we're intentionally excluding 0, O, I, and 1 for readability
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    var result = '';
    for (var i = 0; i < 9; i++)
        result += chars.charAt(Math.floor(Math.random() * chars.length));

    return result;
}



////////////////////////////////////////////////////////////////// 
//run on local for testing
////////////////////////////////////////////////////////////////// 
app.listen(8080, function(){
    console.log('- Server listening on port 8080'.grey);
});
