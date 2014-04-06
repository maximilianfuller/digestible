//digestable node.js based server

//dependencies
var http = require('http');
var	colors = require('colors');
var	express = require('express');
var engines = require('consolidate');
var anyDB = require('any-db');
var mailer = require('nodemailer');
var HashMap = require('hashmap').HashMap;
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
var scheduled_emails = new HashMap(); //key: email_id, value: a scheduled email



/* ////////////////////////////////////////////
End of initialization
*//////////////////////////////////////////////

/* ////////////////////////////////////////////
Email Scheduling
*//////////////////////////////////////////////

function scheduleEmail(email_id, millsFromNow) {
    var job = setTimeout(function() {
        sendEmail(mailOptions);
    },millis);
}

/*
*
* sample params:
senderName = "Fred Foo";
senderEmail = "benjamin_resnick@brown.edu";
receiver = "benjamin_resnick@brown.edu, neb301@yahoo.com";
subject = "Hello";
body = "Hello world";
var dateToEmail = new Date(2014, 3, 19, 14, 26 ,0,0); //year, month, day, hour, minute, second, millis
scheduleEmail(senderName,senderEmail,receiver,subject,body,dateToEmail);
*
*/
function sendEmail(email_id){

    email_params = getEmail(email_id);
    senderName = email_params.senderName;
    senderEmail = email_params.senderEmail;
    receiver = email_params.receiver;
    eSubject = email_params.subject;
    body = email_params.contents; 

	// setup e-mail data with unicode symbols
	var mailOptions = {
	    from: senderName + " <" + senderEmail + ">", // sender address
	    to: receiver, // list of receivers
	    subject: eSubject, // Subject line
	    text: contents // plaintext body

	    //remember to add comma if using html field
	    //html: "<b>Hello world</b>" // html bodies can also be sent
	};	

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message.cyan);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });
}

/* ////////////////////////////////////////////
end email testing
*//////////////////////////////////////////////

/* ////////////////////////////////////////////
ajax/server input handling
*//////////////////////////////////////////////

//server communications comes in here-
//is this the way we wanna do things?
app.post('*', function(request, response){
    console.log("received post");
});

app.get('consumer/:collection_id', function(request, response){
    var collection_id = request.params.collection_id;

});


/* ////////////////////////////////////////////
Internal server functionality
*//////////////////////////////////////////////


//constructor for a new Entry object
//eg var entry = new Entry(blah, blah, blah)
function Entry(entry_id, collection_id, author, title, date_submitted, subject, content) {
    this.entry_id = entry_id;
    this.collection_id = collection_id;
    this.author = author;
    this.title = title;
    this.date_submitted = date_submitted;
    this.subject = subject;
    this.content = content;
}

//constructor for an Email object
function Email(email_id, recipient,date_to_send, entry_id, collection_id) {
    this.email_id = email_id;
    this.date_to_send = date_to_send;
    this.entry_id = entry_id;
    this.collection_id = collection_id;
}

//constructor for a Collection object
function Collection(collection_id, collection_title, creator_email) {
    this.collection_id = collection_id;
    this.collection_title = collection_title;
    this.creator_email = creator_email;
}

//puts an entry into the database 
function addEntry(entry){
    conn.query('INSERT INTO Entries (collection_id, author, title, '+
        'date_submitted, subject, content)' + 
        'VALUES ($1, $2, $3, $4, $5, $6)', 
        [
            entry.collection_id,
            entry.author, 
            entry.title,
            entry.date_submitted,
            entry.subject,
            entry.content
        ]).on('error', console.error);
}


function getEntry(entry_id) {
    conn.query('SELECT * FROM Entries WHERE entry_id=$1', [entry_id],
        function(error, result) {
            if(result.rows.length == 0) {
                return null;
            }
            if(result.rows.length >= 2) {
                console.error('entry id corresponds to multiple entries')
            }
            return new Entry(
                entry_id,
                result.rows[0].collection_id,
                result.rows[0].author,
                result.rows[0].title,
                result.rows[0].date_submitted,
                result.rows[0].subject,
                result.rows[0].content
            );


        });
}

//gets all the entries in a given collection
function getEntriesWithCollectionID(collection_id) {
    conn.query('SELECT * FROM Entries WHERE collection_id=$1', [collection_id],
        function(error, result) {
            var entries = [];
            for(var i = 0; i < result.rows.length; i++) {
                entries.push(new Entry(
                    result.rows[i].entry_id,
                    collection_id,
                    result.rows[i].author,
                    result.rows[i].title,
                    result.rows[i].date_submitted,
                    result.rows[i].subject,
                    result.rows[i].content
                ));
            }
            return entries;
        });
}


//updates an entry in the database (based on its collection id)
function editEntry(entry){
    conn.query('UPDATE Entries ' + 
        'SET collection_id=$2, author=$3, title=$4, ' +
        'date_submitted=$5, subject=$6, content=$7 ' + 
        'WHERE entry_id=$1',
        [
            entry.entry_id, 
            entry.collection_id,
            collection.author, 
            entry.title,
            entry.date_submitted,
            entry.subject,
            entry.content
        ]).on('error', console.error);
}


//deletes an entry
function deleteEntry(entry_id){
    conn.query('DELETE FROM Entries WHERE entry_id=$1', [entry_id])
        .on('error', console.error);
    //TODO: update emails
}


//puts a collection into the database 
function addCollection(collection){
    conn.query('INSERT INTO Collections (collection_title TEXT, creator_email TEXT)' + 
        'VALUES ($1, $2)', 
        [
            collection.collection_title,
            collection.creator_email,
        ]).on('error', console.error);
}


//gets the collection with the given collection id. If none exists,
//returns null
function getCollection(collection_id) {
    conn.query('SELECT * FROM Collections ' + 
        'WHERE collection_id=$1',
        [
            collection_id
        ],
        function(error, result) {
            if(result.rows.length == 0) {
                return null;
            }
            if(result.rows.length >= 2) {
                console.error('collection id corresponds to multiple collections')
            }
            return new Collection(result.rows[0].collection_id, 
                result.rows[0].collection_title, result.rows[0].creator_email);
        
        });
}

//returns an array of collections under a given creator_email
function getCollectionsWithCreator(creator_email) {
    conn.query('SELECT * FROM Collections WHERE creator_email=$1', [creator_email],
        function(error, result) {
            var collections = [];
            for(var i = 0; i < result.rows.length; i++) {
                collections.push(new Collection(
                    result.rows[i].collection_id,
                    result.rows[i].collection_title,
                    creator_email
                ));
            }
            return collections;
        });
}

//updates a collection in the database
function editCollection(collection) {
    conn.query('UPDATE Collections ' + 
        'SET collection_title=$2, creator_email=$3, ' +
        'WHERE collection_id=$1',
    [
        collection.collection_id,
        collection.collection_title,
        collection.creator_email
    ]).on('error', console.error);
}

//deletes a collection in the database
function deleteCollection(collection_id) {
    conn.query('DELETE FROM Collections WHERE collection_id=$1',
        [collection_id])
        .on('error', console.error);
}

//puts an email into the database 
function addEmail(email){
    conn.query('INSERT INTO Emails (recipient, date_to_send , entry_id , collection_id)' + 
        'VALUES ($1, $2, $3, $4)', 
        [
            email.recipient,
            email.date_to_send,
            email.entry_id,
            email.collectoin_id
        ]).on('error', console.error);
}

//updates an email in the database (based on its email_id)
function editEmail(email){
    conn.query('UPDATE Emails ' + 
        'SET recipient=$2, date_to_send=$3, entry_id=$4, collection_id=$5' +
        'WHERE email_id=$1',
    [
        email.email_id,
        email.recipient,
        email.date_to_send,
        email.entry_id,
        email.collectoin_id
    ]).on('error', console.error);
    }


//deletes an entry
function deleteEmail(email_id){
    conn.query('DELETE FROM Emails WHERE email_id=$1', [email_id])
        .on('error', console.error);
}

//creates a subscription
function subscribe(collection_id, reader_email, millsToFirst, millsInterval){
    //create a bunch of emails

}

//unsubscribes
function unsubscribe(collection_id, reader_email){

}




////////////////////////////////////////////////////////////////// 
//run on local for testing
////////////////////////////////////////////////////////////////// 
app.listen(8080, function(){
    console.log('- Server listening on port 8080'.grey);
});
