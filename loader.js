var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://digestible.db');

conn.query('CREATE TABLE Emails (email-id TEXT PRIMARY KEY, recipient TEXT, ' + 
    'date-to-send TEXT, entry-id TEXT, collection-id TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Entries (entry-id TEXT PRIMARY KEY, collection-id TEXT, ' + 
    'author TEXT, title TEXT, date-submitted TEXT, content TEXT);') 
    .on('error', function() {
    	console.error; 
    });

conn.query('CREATE TABLE Collections (collection-id TEXT PRIMARY KEY, ' + 
    'collection-title TEXT, creator-email TEXT);') 
    .on('error', function() {
        console.error; 
    });

conn.query('CREATE TABLE Creator-login (email TEXT PRIMARY KEY, password TEXT)')
	.on('error', function() {
		console.error;
	});


//DATABASES
    //email TABLE
    	//email id
    	//recipient
    	//date to send
    	//entry id
    	//collection id
    	//(to delete an email, select by collection id and recipient)
    	//hash map of email ids to jobs

    //entry TABLE
    	//(primary) entry id
    	//collection id
    	//author
    	//title
    	//date-submitted
    	//content
    	//color scheme
    	//more data

    //collections TABLE
        //(primary) collection-id
        //collection title
        //creator email

    //username and password TABLE (for creators only)
    	//(primary) email
    	//password

    //////////OPTIONAL///////////
    //(for creator's dashboard)
    	//(primary) creator id
    	//collection id



