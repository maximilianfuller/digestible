var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://digestible.db');

conn.query('CREATE TABLE Emails (email_id INTEGER PRIMARY KEY AUTOINCREMENT, recipient TEXT, ' + 
    'date_to_send TEXT, entry_id TEXT, collection_id TEXT, subject TEXT, content TEXT, status TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Entries (entry_id INTEGER PRIMARY KEY AUTOINCREMENT, collection_id TEXT, ' + 
    'entry_number INT, author TEXT, title TEXT, date_submitted INT, subject TEXT, content TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Collections (collection_id INTEGER PRIMARY KEY AUTOINCREMENT, ' + 
    'collection_title TEXT, collection_description TEXT, creator_email TEXT, visible TEXT, email_interval INT);') 
    .on('error', function() {
        console.error; 
    });

conn.query('CREATE TABLE Creator_Data (email TEXT PRIMARY KEY, password TEXT, ' + 
    'name TEXT, street_address TEXT, city TEXT, state TEXT, zipcode TEXT)')
	.on('error', function() {
		console.error;
	});

conn.end();


//DATABASES
    //email TABLE
    	//email id
    	//recipient
    	//date to send milliseconds since 1/1/1970 00:00:00 UTC
    	//entry id
    	//collection id
        //subject
        //content
        //status (either "PENDING", "SENT", or "CANCELLED")
    	//(to delete an email, select by collection id and recipient)
    	//hash map of email ids to jobs

    //entry TABLE
    	//(primary) entry id
    	//collection id
    	//author   NO LONGER NECESSARY
    	//title    NO LONGER NECESSARY
    	//date_submitted
    	//content
    	//color scheme
    	//more data

    //collections TABLE
        //(primary) collection_id
        //collection title
        //collection description
        //creator email
        //visible (true or false string; determines 
            //whether the public (suscribers, can view this collection))
        //email_interval (time in milliseconds between emails)

    //username and password TABLE (for creators only)
    	//(primary) email
    	//password
        //name
        //street address
        //city
        //state
        //zipcode

    //////////OPTIONAL///////////
    //(for creator's dashboard)
    	//(primary) creator id
    	//collection id



