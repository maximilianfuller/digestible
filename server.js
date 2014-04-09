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

function scheduleEmail(email_id, millisFromNow) {
    var job = setTimeout(function() {
        sendEmail(email_id);
    },millisFromNow);

    scheduled_emails.set(email_id,job);
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
    });
}

/* ////////////////////////////////////////////
end email testing
*//////////////////////////////////////////////

/* ////////////////////////////////////////////
ajax/server request handling
*//////////////////////////////////////////////


app.post('/consumer/sign_up', function(request, response){
    console.log("received sign_up request");

    var name = request.body.name; //format params for a subscription
    var reader_email = request.body.email;
    var collection_id = request.body.collection_id;
    millisToFirst = 0;
    millisInterval = 86400000; //one day

    //subscribe
    //subscribe(collection_id, reader_email, millisToFirst, millisInterval);
    response.send("success");//on successful signup
});

//route and respond to ajax message-related posts
app.post('/:roomName/messages.json', function(request, response){ 
    //handle refreshMessages requests
    console.log("potota");
});



app.post('/*', function(request, response){
   console.log("receivedpost");
/*   var collection_id = request.params.post;
    console.log("aq" + collection_id);*/

});

app.post('*', function(request, response){
   console.log("asdfreceivedpost");
   var collection_id = request.params.post;
    console.log("aq" + collection_id);

});


app.get('/consumer/:collection_id', function(request, response){
    var collection_id = request.params.clolection_id;
    console.log("consumer req" + collection_id);

    //start storing relevant moustache params
    var moustacheParams = [];
    moustacheParams.push({collectionName: collection_id});
/*
    //check if the collection exists
    if(getCollection(collection_id) !== null){
        
        //create moustache field for entry names
        var entryList =  [];
        var entries = getEntriesWithCollectionID(collection_id); //db entry return results
        var orderedEntries = []; //ordered db results
        
        //order the entries by entry_number
        for(var i = 0; i < entries.length; i++){ 
            orderedEntries[entries[i].entry_number] = entries[i];
        }//generate the moustache fields
        for(var i = 0; i < entries.length; i++){ 
            entryList.push({entryTitle: orderedEntries[i].title});
        }

        //add the entry name fields to the moustacheParams
        moustacheParams.push(entryList);*/

        //render the webpage
        response.render('consumer.html',moustacheParams);    
  /*  }
    else{ //render a 404 page
        console.log("invalid collection access attempt");
    }   */
});


/* ////////////////////////////////////////////
Database wrappers
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
function Email(email_id, recipient, date_to_send, entry_id, collection_id) {
    this.email_id = email_id;
    this.recipient = recipient;
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

//puts an entry into the database and calls callback on the entry id
function addEntry(entry, callback){
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
        ]).on('error', console.error).on('end', function() {
             conn.query('SELECT last_insert_rowid() FROM Entries',
                function(error, result) {
                    if(error)
                        console.error;
                     else {
                        var id = result.rows[0]['last_insert_rowid()'];
                        callback(id);
                    }
                });
        });
   

}

//gets the entry with the given entry_id then calls callback on the resulting entry
//this entry is null if no entry could be found
function getEntry(entry_id, callback) {
    conn.query('SELECT * FROM Entries WHERE entry_id=$1', [entry_id],
        function(error, result) {
            if(error)
                console.error;
            if(result.rowCount === 0) {
                callback(null);
            }
            else if(result.rowCount >= 2) {
                console.log('ERROR: entry id corresponds to multiple entries')
            } else {
                callback(new Entry(
                    entry_id,
                    result.rows[0].collection_id,
                    result.rows[0].author,
                    result.rows[0].title,
                    result.rows[0].date_submitted,
                    result.rows[0].subject,
                    result.rows[0].content
                ));
            }


        });
}

//calls callback on an array of all the entries in a given collection
function getEntriesWithCollectionID(collection_id, callback) {
    conn.query('SELECT * FROM Entries WHERE collection_id=$1', [collection_id],
        function(error, result) {
            if(error)
                console.error;
            var entries = [];
            for(var i = 0; i < result.rowCount; i++) {
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
            callback(entries);
        });
}


//updates an entry in the database (based on its entry id)
function editEntry(entry){
    conn.query('UPDATE Entries SET collection_id=$1, author=$2, title=$3, date_submitted=$4, subject=$5, content=$6 WHERE entry_id=$7;',
        [
            entry.collection_id,
            entry.author, 
            entry.title,
            entry.date_submitted,
            entry.subject,
            entry.content,
            entry.entry_id
        ]).on('error', console.error);
}


//deletes an entry
function deleteEntry(entry_id){
    conn.query('DELETE FROM Entries WHERE entry_id=$1', [entry_id])
        .on('error', console.error);
    //TODO: update emails
}


//puts a collection into the database and calls callback on its id
function addCollection(collection, callback){
    conn.query('INSERT INTO Collections (collection_title, creator_email)' + 
        'VALUES ($1, $2)', 
        [
            collection.collection_title,
            collection.creator_email,
        ]).on('error', console.error).on('end', function() {
            conn.query('SELECT last_insert_rowid() FROM Collections',
            function(error, result) {
                if(error)
                    console.error;
                else if(result.rowCount == 0) {
                    callback(null);
                } else {
                    var id = result.rows[0]['last_insert_rowid()'];
                    callback(id);
                }
            });
        });
    


}


//gets the collection with the given collection id. And calls 
//callback on the resulting collection
function getCollection(collection_id, callback) {
    conn.query('SELECT * FROM Collections ' + 
        'WHERE collection_id=$1',
        [collection_id],
        function(error, result) {
            if(error)
                console.error;
            if(result.rowCount == 0) {
                callback(null);
            } else if(result.rowCount >= 2) {
                console.log('ERROR: collection id corresponds to multiple collections')
            } else {
                callback(new Collection(result.rows[0].collection_id, 
                    result.rows[0].collection_title, result.rows[0].creator_email));
            }
        });
}

//calls callback on an array of all the collections under a given creator_email
function getCollectionsWithCreator(creator_email, callback) {
    conn.query('SELECT * FROM Collections WHERE creator_email=$1', [creator_email],
        function(error, result) {
            var collections = [];
            for(var i = 0; i < result.rowCount; i++) {
                collections.push(new Collection(
                    result.rows[i].collection_id,
                    result.rows[i].collection_title,
                    creator_email
                ));
            }
            callback(collections);
        });
}

//updates a collection in the database
function editCollection(collection) {
    conn.query('UPDATE Collections ' + 
        'SET collection_title=$1, creator_email=$2 ' +
        'WHERE collection_id=$3',
    [
        collection.collection_title,
        collection.creator_email,
        collection.collection_id
    ]).on('error', console.error);
}

//deletes a collection in the database
function deleteCollection(collection_id) {
    conn.query('DELETE FROM Collections WHERE collection_id=$1',
        [collection_id])
        .on('error', console.error);
}

//puts an email into the database and calls callback on its id
function addEmail(email, callback) {
    conn.query('INSERT INTO Emails (recipient, date_to_send , entry_id , collection_id)' + 
        'VALUES ($1, $2, $3, $4)', 
        [
            email.recipient,
            email.date_to_send,
            email.entry_id,
            email.collection_id
        ]).on('error', console.error).on('end', function() {
            conn.query('SELECT last_insert_rowid() FROM Emails',
                function(error, result) {
                    if(error)
                        console.error;
                    else if(result.rowCount == 0) {
                        callback(null);
                    } else {
                        var id = result.rows[0]['last_insert_rowid()'];
                        callback(id);
                    }
                });
        });
    
}

//calls callback on the the email with the given email id (could be null if none
// exist with the given email_id)
function getEmail(email_id, callback) {
    conn.query('SELECT * FROM Emails WHERE email_id = $1', [email_id],
        function(error, result) {
            if(error) {
                console.error;
            }
            if(result.rowCount >= 2) {
                console.log('ERROR: email id corresponds to multiple emails');
            } else if(result.rowCount == 0) {
                callback(null);
            } else {
                callback(new Email(email_id,
                    result.rows[0].recipient, 
                    result.rows[0].date_to_send, 
                    result.rows[0].entry_id, 
                    result.rows[0].collection_id));
            }
        });
}

/* NOT TO BE USED
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
        email.collection_id
    ]).on('error', console.error);
    }
    */


//deletes an entry
function deleteEmail(email_id){
    conn.query('DELETE FROM Emails WHERE email_id=$1', [email_id])
        .on('error', console.error);
}





//////////////////////////////////////////////
//test cases for DB wrappers
//NOTE: must be run with a freshly loaded DB
//////////////////////////////////////////////
function assert(cond) {
    if(!cond) {
        console.log("assertion failed");
    } else {
        //console.log("assertion passed");
    }
}


var c1 = new Collection(null, "boss instructions", "max@gmail.com");

addCollection(c1, function(c1_id) {
    
    var e1 = new Entry(null, c1_id, "max", 
        "how to be a boss", new Date(Date.now()), "hello", "be a boss.");
    var e2 = new Entry(null, c1_id, "max", 
        "how to be a boss2", new Date(Date.now()), "hello", "be a boss.");
    addEntry(e1, function(e1_id) {
        addEntry(e2, function(e2_id) {
            var email1 = new Email(null, 
                "ben@gmail.com", new Date(Date.now()+60000), e1_id, c1_id);
            var email2 = new Email(null, 
                "javier@gmail.com", new Date(Date.now()+120000), e1_id, c1_id);
            addEmail(email1, function(email1_id) {

                //GET EMAILS WITH COLLECTION ID
                getEntriesWithCollectionID(c1_id, function(entries) {
                    assert(entries[0].title === "how to be a boss" && entries[1].title === "how to be a boss2");
                });

                //GET COLLECTIONS WITH CREATOR
                getCollectionsWithCreator('max@gmail.com', function (collections) {
                    assert(collections[0].collection_title === "boss instructions");
                });

                //EMAIL ADDING/GETTING
                getEmail(email1_id, function (email) {
                    assert(email.recipient === 'ben@gmail.com');
                });

                deleteEmail(email1_id);

                //EMAIL DELETING
                getEmail(email1_id, function (email) {
                    assert(email== null);
                });

                //ENTRY ADDING/GETTING
                getEntry(e1_id, function(entry) {
                    assert(entry.author === "max");
                });
                
                e1.entry_id = e1_id;
                e1.author = "pete";
                editEntry(e1);

                //ENTRY EDITING
                getEntry(e1_id, function(entry) {
                    assert(entry.author === "pete");
                });
                
                deleteEntry(e1_id);
                deleteEntry(e2_id);

                //ENTRY DELETION
                getEntry(e1_id, function(entry) {
                    assert(entry == null);
                });

                //COLLECTION ADDING/GETTING
                getCollection(c1_id, function(collection) {
                    assert(collection.collection_title === "boss instructions");
                });
                
                c1.collection_id = c1_id;
                c1.collection_title = "new boss instructions";
                editCollection(c1);

                //COLLECTION EDITING
                getCollection(c1_id, function(collection) {
                    assert(collection.collection_title === "new boss instructions");
                });

                deleteCollection(c1_id);

                //COLLECTION DELETION
                getCollection(c1_id, function(collection) {
                    assert(collection == null);
                });
            });
        });
        
    });
});


////////////////////////////////////////////////////////////////// 
//Subscribing
////////////////////////////////////////////////////////////////// 

//creates a subscription
function subscribe(collection_id, reader_email, millsToFirst, millsInterval){
    var entries = getEntriesWithCollectionID(collection_id);
    var currentMills = millsToFirst;
    for(var i = 0; i < entries.length; i++) {
        var email = new Email(null, reader_email, 
            Date.now() + currentMills, entries[i], collection_id);
        addEmail(email, new function(email_id) {
            scheduleEmail(email_id, currentMills);
        });

        currentMills+=millsInterval;
    }

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
